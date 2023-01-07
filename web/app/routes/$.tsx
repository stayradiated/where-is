import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import type { RenderableTreeNode, ValidateError } from '@markdoc/markdoc'

import PhotoSwipeCSS from 'photoswipe/dist/photoswipe.css'

import { Page, PageCSS } from '~/components/page'
import { MarkdocErrorList, MarkdocCSS } from '~/components/markdoc'
import { BitCSS } from '~/components/bit'

import {
  fetchContent,
  transformMarkdoc,
  type References,
} from '~/lib/antlers.server'
import { usePhotoSwipe } from '~/hooks/use-photo-swipe'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: PhotoSwipeCSS },
  { rel: 'stylesheet', href: PageCSS },
  { rel: 'stylesheet', href: BitCSS },
  { rel: 'stylesheet', href: MarkdocCSS },
]

type LoaderData =
  | {
      success: true
      renderableTreeNode: RenderableTreeNode
      references: References
    }
  | {
      success: false
      errors: ValidateError[]
      source: string
    }

export const loader: LoaderFunction = async (props) => {
  const { params } = props
  const pageId = params['*']
  invariant(typeof pageId === 'string', 'Must specify page')
  invariant(typeof pageId.endsWith('.md'), 'Must be markdown file')

  const content = await fetchContent({ pageId })
  if (content instanceof Error) {
    return {
      success: false,
      errors: [content],
      source: '',
    }
  }

  const source = content.responseText
  const sourceHash = content.responseHash

  const result = await transformMarkdoc({ pageId, source, sourceHash })
  if (result instanceof Error) {
    return {
      success: false,
      errors: [result],
      source: '',
    }
  }

  return json<LoaderData>(
    result.success
      ? result
      : {
          ...result,
          source,
        },
  )
}

export default function Route() {
  const loaderData = useLoaderData<LoaderData>()
  const { galleryClassName } = usePhotoSwipe()

  if (!loaderData.success) {
    const { errors, source } = loaderData
    return <MarkdocErrorList errors={errors} source={source} />
  }

  const { renderableTreeNode, references } = loaderData
  return (
    <Page
      content={renderableTreeNode}
      context={{ references }}
      className={galleryClassName}
    />
  )
}