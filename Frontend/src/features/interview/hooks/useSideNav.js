import { useState } from 'react'

export const useSideNav = () => {
    const [isOpen, setIsOpen] = useState(true)

    const toggleMenu = () => {
        setIsOpen((prev) => !prev)
    }

    return { isOpen, toggleMenu }
}
