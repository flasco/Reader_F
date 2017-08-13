
export default class getNet {
    static refreshChapter(booklist,callback) {
        for (let i = 0, j = booklist.length; i < j; i++) {
            let bookChapterLst = booklist[i].bookName + '_list';
            let latech = booklist[i].latestChapter;
            let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + booklist[i].url;
            this.get(url,bookChapterLst,latech,(latechap)=>{
                booklist[i].latestChapter = latechap;
                callback();
            });
        }
    }

    static get(url,bookChapterLst,latech,callback){
        fetch(url).then((Response) => Response.json()).then(responseData => {
            let data = responseData.reverse();
            let tit = data[0].title.length > 25 ? data[0].title.substr(0, 18) + '...' : data[0].title;
            callback(tit);
            if(tit === latech) {
                console.log('not update');
                return;
            }else{
                let n = [];
                let i = 0;
                while (i < data.length) {
                    n.push({
                        key: data[i].url,
                        title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
                    });
                    i++;
                }
                DeviceStorage.save(bookChapterLst, n);
            }
        });
    }

}