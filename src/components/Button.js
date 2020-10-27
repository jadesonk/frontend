import styled from 'styled-components';

const ButtonDiv = styled.button`
  border: 0;
  outline: 0;
  width: 100%;
  padding: 1.5rem;
  font-size: 2rem;
  line-height: 3rem;
  font-weight: ${(props) => props.theme.font.bold};
  color: ${(props) => props.theme.whiteColor};
  cursor: pointer;
  transition: ease 0.15s;
  background-color: ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.boxShadow};
  &:not(.loading):hover {
    filter: brightness(95%);
  }
  &:not(.loading):active {
    filter: brightness(90%);
  }
  &.loading {
    background-color: ${(props) => props.theme.loadingColor};
  }
`

export default function Button(props) {
  const buttonText = !props.isLoaded ? 'Loading...'
    : props.activeShift ? "Clock out"
    : "Clock in"

  return (
    <ButtonDiv
      className={!props.isLoaded && 'loading'}
      onClick={props.onClick}
    >
      {buttonText}
    </ButtonDiv>
  );
}
