// Class names for button-styled elements. A function, not a component, so the
// same look works on <button>, <a> and <Link>:  <Link className={buttonClass()} ...>

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'md' | 'sm'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-accent text-background hover:bg-accent/85',
  secondary: 'border-line bg-surface text-foreground hover:border-muted',
  danger: 'border-transparent bg-danger text-white hover:bg-danger/85',
  ghost: 'border-transparent bg-transparent text-muted hover:bg-sunken hover:text-foreground',
}

const sizes: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-2.5 py-1 text-xs',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md') {
  return `${base} ${variants[variant]} ${sizes[size]}`
}
