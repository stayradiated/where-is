import type { Schema } from '@markdoc/markdoc'

type LocationProps = {
  arriveAt: string
  departAt?: string
  location: string
  country: string
  image?: string
  imageAlignV?: number
  href?: string
  height?: number
}

const location: Schema = {
  render: 'Location',
  children: [],
  attributes: {
    arriveAt: { type: String, required: true },
    departAt: { type: String },
    location: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String },
    imageAlignV: { type: Number },
    href: { type: String },
    height: { type: Number, default: 0.5 },
  },
}

export { location }
export type { LocationProps }
