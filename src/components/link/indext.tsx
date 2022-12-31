import NextLink, { LinkProps as NextLinkProps } from 'next/link'

type LinkProps = {
  href: NextLinkProps['href']
  target?: string
  children?: React.ReactNode
}

const Link: React.FC<LinkProps> = (props) => (
  <NextLink
    href={props.href}
    passHref
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    {props.children}
  </NextLink>
)

export default Link
