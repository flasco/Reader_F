'use strict';

var React = require('react');
var { PropTypes } = React;

var ReactNative = require('react-native');
var {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
  Easing,
} = ReactNative;

var StaticRenderer = require('react-native/Libraries/Components/StaticRenderer');
var TimerMixin = require('react-timer-mixin');

var DefaultViewPageIndicator = require('./DefaultViewPageIndicator');
var deviceWidth = Dimensions.get('window').width;
var ViewPagerDataSource = require('./ViewPagerDataSource');

//私人定制
const LeftBoundary = deviceWidth / 4;
const RightBoundary = deviceWidth - LeftBoundary;

var ViewPager = React.createClass({
  mixins: [TimerMixin],

  statics: {
    DataSource: ViewPagerDataSource,
  },

  propTypes: {
    ...View.propTypes,
    dataSource: PropTypes.instanceOf(ViewPagerDataSource).isRequired,
    renderPage: PropTypes.func.isRequired,
    onChangePage: PropTypes.func,
    renderPageIndicator: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool
    ]),
    isLoop: PropTypes.bool,
    locked: PropTypes.bool,
    autoPlay: PropTypes.bool,
    animation: PropTypes.func,
    initialPage: PropTypes.number,
  },

  fling: false,

  getDefaultProps() {
    return {
      isLoop: false,
      locked: false,
      animation: function(animate, toValue, gs) {
        return Animated.timing(animate,
          {
            toValue: toValue,
            duration: 180,
            easing: Easing.linear,
            useNativeDriver: true,//使用原生驱动，更加流畅
          });
      },
    };
  },

  getInitialState() {
    var maxP ;
    return {
      flax:0,
      toprev:0,
      currentPage: 0,
      viewWidth: 0,
      scrollValue: new Animated.Value(0)
    };
  },

  componentWillMount() {
    this.childIndex = 0;
    this.maxP = this.props.dataSource.getPageCount();
    var release = (e, gestureState) => {
      var relativeGestureDistance = gestureState.dx / deviceWidth,
          vx = gestureState.vx;

      var step = 0;
      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -1e-6)) {
        step = 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 1e-6)) {
        step = -1;
      }
      /**
       *   x0 是x轴的起始位置
       *   moveX 是x轴的结束滑动位置，如果没滑就是0
       */
      let clickX = gestureState.x0;
      let moveX = gestureState.dx;
      let flag = gestureState.moveX === 0 ? 0 : ( gestureState.moveX > gestureState.x0 ? -1 : 1 ) ;
      // if(gestureState.moveX === 0){//点击事件
      //   // console.log(gestureState.moveX +' '+gestureState.x0);
      //   flag = 0;
      // }else{
      //   flag = gestureState.moveX > gestureState.x0 ? -1 : 1;
      // }


      if(clickX> RightBoundary && moveX == 0 || flag === 1){
        this.props.hasTouch && this.props.hasTouch(false);
        this.setState({toprev:0},()=>{
          this.movePage(1, gestureState,moveX !== 0);//moveX !== 0 这里是判断是否启用动画效果
          return ;
        });
      }else if(clickX< LeftBoundary && moveX == 0 || flag === -1){
        this.props.hasTouch && this.props.hasTouch(false);
        this.setState({toprev:1},()=>{
          this.movePage(-1, gestureState,moveX !== 0);
          return ;
        });
      }else if( clickX> LeftBoundary && clickX< RightBoundary  && moveX ==0){
         this.props.clickBoard();//可以在这里做文章，在打开菜单的时候屏蔽一切滑动操作
         return ;
      }

      this.props.hasTouch && this.props.hasTouch(false);

      this.movePage(step, gestureState);
    };

    
    this._panResponder = PanResponder.create({
      // Claim responder if it's a horizontal pan
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          
          if (this.props.locked !== true && !this.fling) {
              
            this.props.hasTouch && this.props.hasTouch(true);
            
            return true;
          }
        }
      },

      
      // Touch is released, scroll to the one that you're closest to
       onPanResponderRelease: release,
      
      onPanResponderTerminate: release,
      
      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        var dx = gestureState.dx;
        var offsetX = -dx / this.state.viewWidth + this.childIndex;
        this.state.scrollValue.setValue(offsetX);
      },
    });

    if (this.props.isLoop) {
      this.childIndex = 1;
      this.state.scrollValue.setValue(1);
    }
    // if(initf === 0){
      var initialPage = Number(this.props.initialPage);
      // initf = 1;
        if (initialPage > 0) {
          this.goToPage(initialPage, false);
        }
    // }
  },

  componentDidMount() {
    // console.log(this.props.dataSource);
    //私人修改
    // console.log('nextProps.Gpag:'+this.props.Gpag);
      if(this.props.Gpag==1){
        this.goToPage(0, false);
      }else if(this.props.Gpag==-1){
        this.goToPage(this.maxP-1, false);
      }
  },



  componentWillReceiveProps(nextProps) {
    
    if (nextProps.autoPlay) {
      this._startAutoPlay();
    } else {
      if (this._autoPlayer) {
        this.clearInterval(this._autoPlayer);
        this._autoPlayer = null;
      }
    }

    if (nextProps.dataSource) {
      var maxPage = nextProps.dataSource.getPageCount();
      this.maxP = maxPage;
      var constrainedPage = Math.max(0, Math.min(this.state.currentPage, maxPage));
      this.setState({
        currentPage: constrainedPage,
      });

      if (!nextProps.isLoop) {
        this.state.scrollValue.setValue(constrainedPage > 0 ? 1 : 0);
      }

      this.childIndex = 0;
      this.fling = false;
    }
    //私人修改
    // console.log('nextProps.Gpag:'+nextProps.Gpag);
    //   if(nextProps.Gpag==1){
    //     this.goToPage(0, false);
    //   }else if(nextProps.Gpag==-1){
    //     this.goToPage(maxPage, false)
    //   }

  },

  _startAutoPlay() {
    if (!this._autoPlayer) {
      this._autoPlayer = this.setInterval(
        () => {this.movePage(1);},
        5000
      );
    }
  },

  goToPage(pageNumber, animate = true) {
    
    var pageCount = this.maxP;
    // if(pageNumber>pageCount) pageNumber = pageCount - 1;
    // console.log('pageNumber:'+pageNumber+'    pageCount:'+pageCount);
    if (pageNumber < 0 || pageNumber > pageCount) {
      // console.error('Invalid page number: ', pageNumber);
      return;
    }

    var step = pageNumber - this.state.currentPage;
    this.movePage(step, null, animate);
  },

  movePage(step, gs, animate = true) {
    var pageCount = this.maxP;
    // console.log('...'+ pageCount)
    var pageNumber = this.state.currentPage + step;
    

    //私人修改
    if(pageNumber>=pageCount&&this.state.toprev==0){
      let tmpag = pageNumber;
      pageNumber = 0;
      if(this.props.getNextPage()===-1){
        pageNumber = tmpag-1;
      }
      this.props.getCurrentPage(pageNumber+1);
      // console.log(pageNumber)
      return;
    }else if(pageNumber<0&&this.state.toprev==1){
        this.props.getPrevPage();
      return ;
    }
    step!==0?this.props.getCurrentPage(pageNumber+1):false;
    if (this.props.isLoop) {
      pageNumber = pageCount == 0 ? pageNumber = 0 : ((pageNumber + pageCount) % pageCount);
    } else {
      pageNumber = Math.min(Math.max(0, pageNumber), pageCount - 1);
    }
    const moved = pageNumber !== this.state.currentPage;
    const scrollStep = (moved ? step : 0) + this.childIndex;
    const nextChildIdx = (pageNumber > 0 || this.props.isLoop) ? 1 : 0;
    const postChange = () => {
      this.fling = false;
      this.childIndex = nextChildIdx;
      this.state.scrollValue.setValue(nextChildIdx);
      this.setState({
        currentPage: pageNumber,
      });
    };

    if (animate) {
      this.fling = true;
      this.props.animation(this.state.scrollValue, scrollStep, gs)
        .start((event) => {
          if (event.finished) {
            postChange();
          }
          moved && this.props.onChangePage && this.props.onChangePage(pageNumber);
        });
    } else {
      postChange();
      moved && this.props.onChangePage && this.props.onChangePage(pageNumber);
    }
  },

  getCurrentPage() {
    return this.state.currentPage;
  },

  renderPageIndicator(props) {
    if (this.props.renderPageIndicator === false) {
      return null;
    } else if (this.props.renderPageIndicator) {
      return React.cloneElement(this.props.renderPageIndicator(), props);
    } else {
      return (
        <View style={styles.indicators}>
          <DefaultViewPageIndicator {...props} />
        </View>
      );
    }
  },

  _getPage(pageIdx, loop = false ) {
    var dataSource = this.props.dataSource;
    var pageID = dataSource.pageIdentities[pageIdx];
    return (
      <StaticRenderer
        key={'p_' + pageID + (loop ? '_1' : '')}
        shouldUpdate={true}
        render={this.props.renderPage.bind(
          null,
          dataSource.getPageData(pageIdx),
          pageID,
          this.state.currentPage
        )}
      />
    );
  },

  render() {
    var dataSource = this.props.dataSource;
    var pageIDs = dataSource.pageIdentities;

    var bodyComponents = [];

    var pagesNum = 0;
    var hasLeft = false;
    var viewWidth = this.state.viewWidth;

    if(pageIDs.length > 0 && viewWidth > 0) {
      // left page
      if (this.state.currentPage > 0) {
        bodyComponents.push(this._getPage(this.state.currentPage - 1));
        pagesNum++;
        hasLeft = true;
      } else if (this.state.currentPage == 0 && this.props.isLoop) {
        bodyComponents.push(this._getPage(pageIDs.length - 1, true));
        pagesNum++;
        hasLeft = true;
      }

      // center page
      bodyComponents.push(this._getPage(this.state.currentPage));
      pagesNum++;

      // right page
      if (this.state.currentPage < pageIDs.length - 1) {
        bodyComponents.push(this._getPage(this.state.currentPage + 1));
        pagesNum++;
      } else if (this.state.currentPage == pageIDs.length - 1 && this.props.isLoop) {
        bodyComponents.push(this._getPage(0, true));
        pagesNum++;
      }
    }

    var sceneContainerStyle = {
      width: viewWidth * pagesNum,
      flex: 1,
      flexDirection: 'row'
    };

    // this.childIndex = hasLeft ? 1 : 0;
    // this.state.scrollValue.setValue(this.childIndex);
    var translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, -viewWidth]
    });

    return (
      <View style={{flex: 1}}
        onLayout={(event) => {
            // console.log('ViewPager.onLayout()');
            var viewWidth = event.nativeEvent.layout.width;
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }
            this.setState({
              currentPage: this.state.currentPage,
              viewWidth: viewWidth,
            });
          }}
        >

        <Animated.View style={[sceneContainerStyle, {transform: [{translateX}]}]}
          {...this._panResponder.panHandlers}>
          {bodyComponents}
        </Animated.View>

        {this.renderPageIndicator({goToPage: this.goToPage,
                            pageCount: pageIDs.length,
                            activePage: this.state.currentPage,
                            scrollValue: this.state.scrollValue,
                            scrollOffset: this.childIndex,
                          })}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  indicators: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

module.exports = ViewPager;
