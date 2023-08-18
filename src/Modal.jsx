import styled from "styled-components";
import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { cloneElement, createContext, useContext, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";

/***** Styled Components ***********/
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;
// create a context object to hold global variables instead of passing
// props down through components
const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  // create handler functions
  const close = () => setOpenName("");
  const open = setOpenName;

  // Provider allows choldren compenents to access global vairables
  // pass in the props to the global context to provide access to child
  // components
  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// open modal window
function Open({ children, opens: opensWindowName }) {
  // get access to the open menthod via the global context
  const { open } = useContext(ModalContext);
  // clone the component with props
  // lets you create a copy of a React component with different props.
  // clone the Component specified in the children props, and props you want to override
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  // retrieve
  const { openName, close } = useContext(ModalContext);

  // setup a reference to close the modal if a click is outside the box
  const ref = useOutsideClick(close, true);

  if (name !== openName) return null;

  // wrap in createPortal so modal can be linked to any DOM element as it's parent.
  // link the ref hook with the <StyledModal> component so it has access to it.
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
export default Modal;
