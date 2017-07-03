import React, {Component} from 'react';
import {StyleSheet, Text, View, ListView,TouchableOpacity} from 'react-native';

export default class NovelList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds,
            load: false
        };
    }
    componentDidMount() {
        this.getNet();
    }
    getNet() {
        let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=http://www.23us.com/html/65/65044/';
        // url =
        // 'http://testdb.leanapp.cn/Analy_x?action=2&url=http://www.23us.com/html/65/65
        // 0 44/26566546.html'
        fetch(url).then((Response) => Response.json()).then(responseData => {
            // console.log(responseData[0].title);
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(responseData.reverse()),
                load: true
            });

        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }
    _renderRow(rowData) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.state.params.callback(rowData.url);
                    this.props.navigation.goBack();
                }}>
            <View style={{height: 38}}>
                <Text style={styles.rowStyle}>{rowData.title}</Text>
            </View>
            </TouchableOpacity>
        );
    }
    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (<View style={styles.solid}/>);
    }

    render() {
        if (this.state.load === true) {
            return (
                <View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderSeparator={this._renderSeparator}
                        renderRow={this
                        ._renderRow
                        .bind(this)}/>
                </View>
            );
        } else {
            return (
                <Text style={styles.welcome}>Loading now.please wait.</Text>
            );
        }
    }
}
const styles = StyleSheet.create({
    welcome: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10
    },
    LatestChapter: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        color: '#8a8a8a'
    },
    rowStyle: {
        marginTop: 12,
        marginLeft: 15
    },
    solid: {
        height: 0.2,
        backgroundColor: 'black',
        marginLeft: 15,
        marginRight: 20
    }
});
