import { createCX } from '~/lib/class-name'

const cx = createCX('page', 'Place')

type PlaceProps = {
  title: string
  category: string
  href: string
  children: React.ReactNode
}

const Place = (props: PlaceProps) => {
  const { title, category, href, children } = props
  return (
    <section className={cx('container')}>
      <a href={href} target="_blank" rel="noopener">
        <h3>{title}</h3>
      </a>
      <em>{category}</em>
      {children}
    </section>
  )
}

export { Place }
