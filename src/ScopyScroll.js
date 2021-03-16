import React from 'react'
import CustomScroll from 'react-custom-scroll';
import Loader from './Loader'

const MAX_VIEW_LENGTH = 30;
const PAGE_LIMIT = 10

class ScopyScroll extends React.Component {
    constructor(props) {
        super(props)
        this.parentElement = React.createRef()
        this.scrollPositionControl = 0;
        this.loadingThrottle = 0
        this.prevScrollPosition = 0;
        this.startPage = 0;
        this.viewedItemsInterval = {
            start: 0,
            end: 30
        }
        this.viewedItems = [];
    }
    setStartPage(page = 0) {
        if (typeof page !== 'number') return;
        this.startPage = page;
    }
    setScrollPositionControl(pos = 0) {
        if (typeof pos !== 'number') return;
        this.scrollPositionControl = pos
    }
    clearLoadingThrottle() {
        clearTimeout(this.loadingThrottle);
    }
    setLoadingThrottle(cb = null) {
        if (typeof cb !== 'function') return;
        this.clearLoadingThrottle()
        this.loadingThrottle = setTimeout(() => {
            cb()
        }, 100)
    }
    setPrevScrollPosition(pos = 0) {
        if (typeof pos !== 'number') return;
        this.prevScrollPosition = pos;
    }
    setViewedItemsInterval(start = 0, end = 30) {
        this.viewedItemsInterval = {start, end}
    }
    getMaxBottomScrollPos() {
        const elementsHeight = this.getViewedItemsHeight(false, true);
        if (elementsHeight === 0 || !this.parentElement.current) return elementsHeight;
        return elementsHeight - this.parentElement.current.offsetHeight
    }
    initViewedItems() {
        const {items} = this.props;
        if (!items.length) return;
        this.viewedItems = items.slice(0, MAX_VIEW_LENGTH)
    }
    updateViewedItems(toBottom = false) {
        const {items} = this.props;
        let startIndex = 0;
        if (items.length > MAX_VIEW_LENGTH && toBottom) {
            startIndex = this.viewedItemsInterval.start + PAGE_LIMIT
        }
        if (toBottom === false && this.viewedItemsInterval.start > 0) {
            startIndex = this.viewedItemsInterval.start - PAGE_LIMIT
        }
        const endIndex = startIndex + MAX_VIEW_LENGTH;
        this.setViewedItemsInterval(startIndex, endIndex)
        // console.log('Slice: ', startIndex, endIndex)
        this.viewedItems = items.slice(startIndex, endIndex)

        setTimeout(() => {
            if (toBottom === true && this.viewedItems.length === MAX_VIEW_LENGTH) {
                const elementsHeight = this.getViewedItemsHeight(false, true)
                const lastItemsHeight = this.getViewedItemsHeight()
                const parentElementHeight = this.parentElement.current.offsetHeight;
                let heightFromTop = elementsHeight - lastItemsHeight - parentElementHeight
                // console.log('SET SCROLL POSITION: ', heightFromTop)
                if (heightFromTop === this.scrollPositionControl) {
                    heightFromTop++
                }
                this.setScrollPositionControl(heightFromTop)
            } else {
                // if not to bottom then effect scroll to top
                let firstItemsHeight = this.viewedItemsInterval.start === 0 ? 0 : this.getViewedItemsHeight(false, false)
                // console.log('SET SCROLL POSITION: ', firstItemsHeight)
                if (firstItemsHeight === this.scrollPositionControl) {
                    firstItemsHeight--
                }
                this.setScrollPositionControl(firstItemsHeight)
            }
        }, 0)
    }
    getViewedItemsHeight(isLast = true, isAll = false) {
        let height = 0;
        const parentEl = this.parentElement.current
        if (!parentEl) return 0;
        const elements = parentEl.querySelectorAll('.scopy-scroll__item');
        let from, to;
        if (isLast) {
            from = elements.length - 10,
            to = elements.length
        } else if (isAll) {
            from = 0
            to = elements.length
        } else if (isLast === false) {
            from = 0;
            to = 10
        }
        const elArray = []
        for( let i = 0; i < elements.length; i++) {
            let el = elements[i]
            elArray.push(el)
            // console.log('element: ', el, height)
            // height += el.offsetHeight;
        }
        elArray.forEach((item, index) => {
            if (index >= from && index < to) {
                height += item.offsetHeight;
            }
        })
        return height;
    }
    scrollViewedItems(e) {
        const {onLoadMore, lastPage, items} = this.props;
        const {scrollTop} = e.target;
        const parentEl = this.parentElement.current
        const parentHeight = parentEl.offsetHeight;
        const elementsHeight = this.getViewedItemsHeight(false, true)
        // scroll to bottom
        if (scrollTop > this.prevScrollPosition) {
            // startPage starts from 0 then +1, and new we're on page before load then +1
            if ((this.startPage + 2) > lastPage) {
                this.setPrevScrollPosition(scrollTop)
                return
            }
            const scrollBottom = parentHeight + scrollTop;
            // const scrollPosBeforeLoad = (4 * elementsHeight) / 5;
            if (scrollBottom >= elementsHeight) {
                if (items.length < MAX_VIEW_LENGTH || items.length === this.viewedItemsInterval.end) {
                    if ((PAGE_LIMIT * lastPage) === items.length) {
                        this.setPrevScrollPosition(scrollTop)
                        return
                    }
                    this.setLoadingThrottle(() => {
                        this.setStartPage(this.startPage + 1);
                        if (typeof onLoadMore === 'function') onLoadMore()
                    })
                } else {
                    this.setStartPage(this.startPage + 1);
                    this.updateViewedItems(true)
                }
            }
        } else if (scrollTop < this.prevScrollPosition && scrollTop === 0) {
            // scroll to top
                this.setStartPage(this.startPage - 1);
                this.updateViewedItems()
        }
        this.setPrevScrollPosition(scrollTop)
    }

    componentDidMount() {
        const {items} = this.props;
        if (items.length > 0) this.initViewedItems()
    }
    componentDidUpdate(prevProps) {
        const {items} = this.props;
        // side effect from onLoadMore
        if (items.length > prevProps.items.length) this.updateViewedItems(true)
        else if (items.length < prevProps.items.length || items !== prevProps.items) this.updateViewedItems()
    }
    render() {
        const {renderItem, className, loading, loadLocale, lastPage} = this.props;
        const renderLoader = () => {
            if (!loading) return '';
            return <div className='scopy-scroll__loader'>
                <Loader sm overlayed={false} className='mr-4'/>
                <span>{loadLocale}</span>
            </div>
        }
        const maxBottomScrollPos = this.getMaxBottomScrollPos()
        return <div  ref={this.parentElement} className={`scopy-scroll ${className}`}>
            <CustomScroll heightRelativeToParent='100%' onScroll={(e) => this.scrollViewedItems(e)}
                className={`scopy-scroll__scroller
                    ${this.prevScrollPosition < 2 && this.viewedItemsInterval.start === 0 ? 'scopy-scroll__scroller--on-top' : ''}
                    ${(maxBottomScrollPos > 0 && this.prevScrollPosition > (maxBottomScrollPos - 2) && this.viewedItemsInterval.end === (lastPage * PAGE_LIMIT)) || loading === true ? 'scopy-scroll__scroller--on-bottom' : ''}
                `}
                scrollTo={this.scrollPositionControl} {...this.props.customScrollProps}>
                {this.viewedItems.map((item, index) => {
                    return <div className='scopy-scroll__item' key={index}>
                        {renderItem(item, index)}
                    </div>
                })}
            </CustomScroll>
            {renderLoader()}
        </div>
    }
}

ReactScopedScroll.defaultProps = {
    items: [],
    loading: false,
    loadLocale: 'please wait...',
    className: '',
    lastPage: 10,
    onLoadMore: () => {return false},
    renderItem: () => {return false}
}

export default ScopyScroll