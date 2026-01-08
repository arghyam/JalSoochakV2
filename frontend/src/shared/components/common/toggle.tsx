import { Switch, forwardRef } from '@chakra-ui/react'

export interface ToggleProps {
  /**
   * Whether the toggle is checked
   */
  isChecked?: boolean
  /**
   * Whether the toggle is disabled
   */
  isDisabled?: boolean
  /**
   * Callback when toggle state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * Name attribute for the input
   */
  name?: string
  /**
   * ID attribute for the input
   */
  id?: string
}

export const Toggle = forwardRef<ToggleProps, 'input'>((props, ref) => {
  const { isChecked, isDisabled, onChange, name, id } = props

  return (
    <Switch
      ref={ref}
      isChecked={isChecked}
      isDisabled={isDisabled}
      onChange={onChange}
      name={name}
      id={id}
      sx={{
        '.chakra-switch__track': {
          bg: isDisabled ? 'neutral.200' : 'neutral.300',
          width: '44px',
          height: '24px',
          padding: '2px',
          _checked: {
            bg: isDisabled ? 'primary.200' : 'primary.500',
          },
        },
        '.chakra-switch__thumb': {
          width: '20px',
          height: '20px',
          bg: 'white',
          _checked: {
            transform: 'translateX(20px)',
          },
        },
      }}
    />
  )
})

Toggle.displayName = 'Toggle'
