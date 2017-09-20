
export default class getNet {
    static refreshChapter(booklist, callback) {
        for (let i = 0, j = booklist.length; i < j; i++) {
            let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
            let latech = booklist[i].latestChapter;
            let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + booklist[i].url;
            this.get(url, bookChapterLst, latech, (latechap) => {
                booklist[i].latestChapter = latechap;
                callback();
            });
        }
    }

    // static refreshChapter(booklist, callback) {
    //     console.log(booklist)
    //     axios.get(`http://testdb.leanapp.cn/refr?p=${JSON.stringify(booklist)}`, { timeout: 30000 }).then(Response => {
    //         let RefreshList = Response.data;
    //         console.log(RefreshList);

    //         for (let u = 0, j = RefreshList.length; u < j; u++) {
    //             let bookChapterLst = `${booklist[u].bookName}_${booklist[u].plantformId}_list`;
    //             if (RefreshList[u] != '-1') {
    //                 let ReBook = RefreshList[u];
    //                 let n = [];
    //                 let i = 0;
    //                 while (i < ReBook.length) {
    //                     n.push({
    //                         key: ReBook[i].url,
    //                         title: (ReBook[i].title.length > 25 ? ReBook[i].title.substr(0, 18) + '...' : ReBook[i].title)
    //                     });
    //                     i++;
    //                 }
    //                 booklist[u].latestChapter = ReBook[0].title.length > 25 ? ReBook[0].title.substr(0, 18) + '...' : ReBook[0].title;
    //                 DeviceStorage.save(bookChapterLst, n);

    //             }
    //         }
    //         callback();
    //     })
    // }

    static refreshSingleChapter(book) {
        let bookChapterLst = `${book.bookName}_${book.plantformId}_list`;
        let latech = book.latestChapter;
        console.log(book.url);
        let url = 'http://testdb.leanapp.cn/Analy_x?action=1&url=' + book.url;
        this.get(url, bookChapterLst, latech, (latechap) => {
            book.latestChapter = latechap;
        });
    }

    static get(url, bookChapterLst, latech, callback) {
        axios.get(url, { timeout: 8000 }).then(Response => {
            let data = Response.data.reverse();
            let tit = data[0].title.length > 25 ? data[0].title.substr(0, 18) + '...' : data[0].title;
            callback(tit);
            if (tit === latech) {
                console.log('not update');
                return;
            } else {
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
        })
    }

}