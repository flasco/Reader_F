import { AppRegistry, StyleSheet, Text, View, ListView, Button, TextInput } from 'react-native';
import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Foundation';

export default class SearchBook extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            text: '',
            dataSource: ['我欲封天', 'asd', 'sdf',],
        };
    }

    _renderRow = (rowData, sectionID, rowID) => {
        return(
            <Text>{rowData}</Text>
        )
    }

    render() {
        // const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ text })}
                    placeholder={'请输入小说名'}
                    spellCheck={false}
                    returnKeyType={'done'}
                    onSubmitEditing={() => { 
                        if(this.state.text!==''){
                            console.log(this.state.text);
                        }
                        
                        
                     }}
                    value={this.state.text} />
                <Text style={styles.hint}>输入后点击 done 即可搜索书籍。</Text>
                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 7,
        marginRight: 7,
        padding: 2,
    },
    hint: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'center',

    },
    text: {
        flex: 1,
      },
});
