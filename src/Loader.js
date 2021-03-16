import React from 'react';
import LoadIcon from './assets/loadIcon.svg';
class Loader extends React.Component {
    render() {
        const {className} = this.props;
        return <div className={`loader ${className? className: ''}`}>
            <div className='loader__spinner'>
                <LoadIcon/>
            </div>
        </div>
    }
}

export default Loader