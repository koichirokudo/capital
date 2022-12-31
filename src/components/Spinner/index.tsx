import { CircularProgress, styled } from '@mui/material'
import { useSpinnerContext } from 'contexts/SpinnerContext'

const SpinnerWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: `rgba(255, 255, 255, 0.7)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1200,
})

const Spinner = () => {
  const isSpinnerOn = useSpinnerContext()

  return (
    <>
      {isSpinnerOn && (
        <SpinnerWrapper>
          <CircularProgress size={100} />
        </SpinnerWrapper>
      )}
    </>
  )
}

export default Spinner
