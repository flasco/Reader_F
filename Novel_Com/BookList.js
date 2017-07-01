import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, ListView,Button} from 'react-native';

export default class BookList extends Component {
    static navigationOptions = {
        title: 'BookList',
    };

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(['武林高手','美食爱好者']),
            load: false
        };
    }
    componentDidMount() {
        // this.getNet();
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
                <Text style={styles.rowStyle}>{rowData}</Text>
                <View style={styles.solid}></View>
            </View>
        );
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style= {styles.container}> 
            <Button
                onPress={() => navigate('ChaL')}
                title="Chat with Lucy"
            />
                <ListView 
                    style = {{flex:1}}
                    dataSource={this.state.dataSource}
                    renderRow={this
                    ._renderRow
                    .bind(this)}/>
            </View>
            );


    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F5FCFF'
    },
    rowStyle:{
        marginBottom:12,
        marginLeft:20,
    },
    solid:{
        height: 1, 
        backgroundColor: '#8a8a8a',

        
    },
});