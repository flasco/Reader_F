import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, ListView} from 'react-native';

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
        let url = "http://testdb.leanapp.cn/Analy_x?action=1&url=http://www.23us.co" +
                "m/html/65/65044/";
        fetch(url).then((Response) => Response.json()).then(responseData => {
            console.log(responseData[0].title);
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(responseData),
                load: true

            })

        }).catch((Error) => {
            console.warn(Error);
        }).done();
    }
    _renderRow(rowData) {
        return (
            <View style={{height:38}}>
                <View style={styles.solid}></View>
                    <Text style={styles.rowStyle}>{rowData.title}</Text>
            </View>
        );
    }

    render() {
        if (this.state.load === true) {
            return (
                <View>
                    <Text style={styles.welcome}>美食供应商</Text>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this
                        ._renderRow
                        .bind(this)}/>
                </View>
                );
        } else {
            return (
                <Text>Loading now.please wait.</Text>
            );
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    rowStyle:{
        marginTop:12,
        marginLeft:15,
    },
    solid:{
        height: 1, 
        backgroundColor: 'black',
        marginLeft:20,
        marginRight:20,
        
    },
});