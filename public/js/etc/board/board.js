const boardTitle = new Vue({
    el: '.board_title',
    data: {
        boardName: '',
        boardType: '',
        subBoardName: '',
        subBoardType: ''
    }
})
const boardMenu = new Vue({
    el: '.board_bottom_menu',
    data: {
        pages:0,
        activePage:0
    }
})
const boardView = new Vue({
    el: '.board_list',
    data: {
        posts:[],
        boardType
    }
})

const boardChange = (changeBoard) => {
    boardType = changeBoard;
    boardView.boardType = boardType;
    postWindowClose(false);
    if (page>1) {
        boardPageChange(1);
    } else {
        const newUrl = `/board/${boardType}${window.location.search}`;
        newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
        boardRefresh();
    }
}

const boardPageChange = (changePage) => {
    page = changePage;
    boardMenu.activePage = page;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('page', String(changePage));
    const newUrl = `/board/${boardType}?`+urlSearch.toString();
    newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    boardRefresh();
}

const boardLimitChange = (changeLimit) => {
    limit = changeLimit;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('limit', String(changeLimit));
    const newUrl = `/board/${boardType}?`+urlSearch.toString();
    newUrl==location.pathname+location.search? undefined: history.pushState(null, null, newUrl);
    boardRefresh();
}

const boardRefresh = () => {
    progress(20);
    ajax({
        method: 'get',
        url:`/board/${boardType}?page=${page}&limit=${limit}`,
        errorCallback:() => {
            boardView.posts.splice(0);
            boardMenu.pages = 0;
        },
        callback:(data) => {
            boardTitle.boardName = data.boardName;
            boardTitle.boardType = boardType;
            boardTitle.subBoardName = data.subBoard.boardName;
            boardTitle.subBoardType = data.subBoard.boardType;
            boardMenu.activePage = page;
            boardMenu.pages = data.pages;

            const date = new Date();
            let today = ""+date.getFullYear();
            // 날짜 2자리수로 맞추기
            if ((date.getMonth()+1)<10) {
                today += '0';
            }
            today+=date.getMonth()+1;
            if (date.getDate()<10) {
                today += '0';
            }
            today+=date.getDate();

            const boardData = data.board;
            boardView.posts.splice(0);
            if (boardData == null) {
                return;
            }
            boardView.boardType = boardType;
            boardView.posts = boardData.map(e => {
                return {
                    usercode: e.usercode,
                    nickname: e.nickname,
                    boardType: e.boardType,
                    postNo: e.postNo,
                    title: e.title,
                    date: e.date.split(' ')[0].replaceAll("-","")==today? e.date.split(' ')[1]: e.date.split(' ')[0],
                    hit: e.hit,
                    comments: e.comments,
                    totalLike: e.totalLike,
                }
            });
        }
    })
}