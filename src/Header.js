import React from 'react'

const Header = () => {
    const reloadPage = () => {
        window.location.reload();
    }
    return (
        <div className='navbar'>
            <div className='title' onClick={reloadPage}>
                Book Tracker
            </div>
        </div>
    )
}

export default Header