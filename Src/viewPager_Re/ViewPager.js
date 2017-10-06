'use strict';

import React,{ PropTypes } from 'react';

import {
  Dimensions,
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

import StaticRenderer from 'react-native/Libraries/Components/StaticRenderer';
import TimerMixin from 'react-timer-mixin';

import  ViewPagerDataSource from './ViewPagerDataSource';

//私人定制
const deviceWidth = Dimensions.get('window').width;
const LeftBoundary = deviceWidth / 4;
const RightBoundary = deviceWidth - LeftBoundary;
let Shield = 0;//修复呼出菜单之后下一次滑页出现bug

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
    isLoop: PropTypes.bool,
    locked: PropTypes.bool,
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
            duration: 60,
            easing: Easing.linear,
            useNativeDriver: true,//使用原生驱动，更加流畅
          });
      },
    };
  },

  getInitialState() {
    var maxP ;
    return {
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
      Shield = Shield >= 2 ? 0 : Shield;
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

      if( clickX> LeftBoundary && clickX< RightBoundary  && moveX ==0){
        this.props.clickBoard();//可以在这里做文章，在打开菜单的时候屏蔽一切滑动操作
        Shield++;
        return ;
      }

      if(this.props.locked) return false;
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
      }

      this.props.hasTouch && this.props.hasTouch(false);

      this.movePage(step, gestureState);
    };

    
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // Claim responder if it's a horizontal pan
      onMoveShouldSetPanResponder: (e, gestureState) => {
        // console.log(this.props.locked);
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (/* (gestureState.moveX <= this.props.edgeHitWidth ||
              gestureState.moveX >= deviceWidth - this.props.edgeHitWidth) && */
            this.props.locked !== true && !this.fling) {
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
        if(this.props.locked) return false;
        if(Shield>=2){
          return;
        }
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
  },

  goToPage(pageNumber, animate = true) {
    
    let pageCount = this.maxP;
    if (pageNumber < 0 || pageNumber > pageCount) {
      return;
    }

    let step = pageNumber - this.state.currentPage;
    this.movePage(step, null, animate);
  },

  movePage(step, gs, animate = true) {
    let pageCount = this.maxP;
    // console.log('...'+ pageCount)
    let pageNumber = this.state.currentPage + step;
    

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
    step !== 0 && this.props.getCurrentPage(pageNumber+1);
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

    var translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, -viewWidth]
    });

    return (
      <View style={{flex: 1}}
        onLayout={(event) => {
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
