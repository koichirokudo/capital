import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink from '@mui/material/Link'
import { SxProps } from '@mui/material'

type LinkProps = {
  href: NextLinkProps['href']
  target?: string
  children?: React.ReactNode
  sx?: SxProps
}

const Link: React.FC<LinkProps> = (props) => (
  <NextLink
    href={props.href}
    passHref
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <MuiLink
      target={props.target || '_self'}
      rel="noopener noreferrer"
      sx={{ textDecoration: 'none', color: 'inherit' }}
    >
      {props.children}
    </MuiLink>
  </NextLink>
)

export default Link
