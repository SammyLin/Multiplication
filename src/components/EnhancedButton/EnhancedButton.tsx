import type { ReactNode } from 'react'
import { playButtonClick } from '../../utils/improvedSoundEffects'

interface EnhancedButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'magical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  'data-testid'?: string
}

const EnhancedButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  'data-testid': testId,
}: EnhancedButtonProps) => {
  const handleClick = () => {
    if (!disabled) {
      playButtonClick()
      onClick?.()
    }
  }

  const baseClasses = 'font-bold rounded-xl transition-all duration-200 hover-lift focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500',
    magical: 'button-magical text-white focus:ring-purple-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }
  
  const disabledClasses = disabled 
    ? 'opacity-60 cursor-not-allowed transform-none hover:transform-none' 
    : 'cursor-pointer'

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  )
}

export default EnhancedButton
