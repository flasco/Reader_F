import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';


export default class NovelList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: '',
            load: false
        };
    }
    componentDidMount() {
        this.getNet();
    }
    getNet = () => {
        let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=http://www.23us.com/html/65/65044/';
        fetch(url).then((Response) => Response.json()).then(responseData => {
            let data = responseData.reverse();
            let n  = [];
            let i = 0;
            while(i<data.length){
                n.push({key: data[i].url, title:(data[i].title.length>25?data[i].title.substr(0,18)+'...':data[i].title)
                });
                i++;
            }
            this.setState({
                dataSource: n,
                load: true
            });

        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }

    _renderItem = (item) => {
        let txt = item.item.title;
        let url = item.item.key;
        return (
            <TouchableOpacity style={{height: 38}}
                onPress={() => {
                    this.props.navigation.state.params.callback(url);
                    this.props.navigation.goBack();
                }}>
                <Text style={styles.rowStyle}>{txt}</Text>
            </TouchableOpacity>
        );
    }

    _header = () => {
        return (
            <View>
                <Text style={styles.LatestChapter}>[最新章节]</Text>
                <View style={styles.solid}/>
            </View>
        );
    }

    _renderSeparator = () => (<View style={styles.solid}/>)

    render() {
        if (this.state.load === true) {
            return (
                <View>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this._header}
                        ItemSeparatorComponent={this._renderSeparator}
                    />
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
        height: 1,
        backgroundColor: 'black',
        marginLeft: 15,
        marginRight: 20
    }
});
