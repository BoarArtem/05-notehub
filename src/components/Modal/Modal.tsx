import {type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const modalRoot = document.getElementById("modal-root")!;

export default function Modal({
                                  children,
                                  onClose,
                              }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={css.modal}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        modalRoot
    );
}
