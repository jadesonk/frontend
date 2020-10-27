import styled from 'styled-components'

const ButtonDiv = styled.button`
  width: 100%;
  padding: 12px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: ease 0.15s;
  color: #ffffff;
  background-color: #00CA7F;
  border-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0, 0.25);
  &:hover {
    filter: brightness(95%);
  }
  &:active {
    filter: brightness(90%);
  }
`

export default function Button(props) {
  return (
    <ButtonDiv onClick={props.onClick}>{props.text}</ButtonDiv>
  );
}
