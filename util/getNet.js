
export default class getNet {
    static refreshChapter(booklist,callback) {
        for (let i = 0, j = booklist.length; i < j; i++) {
            let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
            let latech = booklist[i].latestChapter;
            let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + booklist[i].url;
            this.get(url,bookChapterLst,latech,(latechap)=>{
                booklist[i].latestChapter = latechap;
                callback();
            });
        }
    }

    static refreshSingleChapter(book){
        let bookChapterLst = `${book.bookName}_${book.plantformId}_list`;
        let latech = book.latestChapter;
        console.log(book.url);
        let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + book.url;
        this.get(url,bookChapterLst,latech,(latechap)=>{
            book.latestChapter = latechap;
        });
    }

    static get(url,bookChapterLst,latech,callback){
        axios.get(url,{timeout:8000}).then(Response=>{
            let data = Response.data.reverse();
            let tit = data[0].title.length > 25 ? data[0].title.substr(0, 18) + '...' : data[0].title;
            callback(tit);
            if(tit === latech) {
                console.log('not update');
                return;
            }else{
                let n = [];
                let i = 0;
                if(data[0].url.indexOf('xs.la')!==-1){
                    while (i < data.length) {
                        n.push({
                            key: data[i].url.replace(/(.*)(\/.*\/){2}(.*)/,'$1$2$3'),
                            title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
                        });
                        
                        i++;
                    }
                }else{
                    while (i < data.length) {
                        n.push({
                            key: data[i].url,
                            title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
                        });
                        i++;
                    }
                }
                DeviceStorage.save(bookChapterLst, n);
            }
        })
    }

}