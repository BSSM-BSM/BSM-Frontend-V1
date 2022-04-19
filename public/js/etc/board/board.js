const boardTitle = new Vue({
    el:'.board_title',
    data:{
        boardName:'',
        boardType:'',
        subBoardName:'',
        subBoardType:''
    }
})
const boardMenu = new Vue({
    el:'.board_bottom_menu',
    data:{
        isLogin:false,
        writeUrl:'javascript:showLoginBox()',
        pages:0,
        activePage:0
    }
})
const boardView = new Vue({
    el:'.board_list',
    data:{
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
        history.pushState(null, null, `/board/${boardType}${window.location.search}`);
        boardRefresh();
    }
}

const boardPageChange = (changePage) => {
    page = changePage;
    boardMenu.activePage = page;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('page', String(changePage));
    history.pushState(null, null, `/board/${boardType}?`+urlSearch.toString());
    boardRefresh();
}

const boardLimitChange = (changeLimit) => {
    limit = changeLimit;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('limit', String(changeLimit));
    history.pushState(null, null, `/board/${boardType}?`+urlSearch.toString());
    boardRefresh();
}

const boardRefresh = () => {
    progress(20);
    ajax({
        method:'get',
        url:`/board/${boardType}?page=${page}&limit=${limit}`,
        error:() => {
            boardView.posts.splice(0);
            boardMenu.pages = 0;
        },
        success:(data) => {
            boardTitle.boardName = data.boardName;
            boardTitle.boardType = boardType;
            boardTitle.subBoardName = data.subBoard.boardName;
            boardTitle.subBoardType = data.subBoard.boardType;

            if (user.isLogin) {
                boardMenu.isLogin = true;
                boardMenu.writeUrl = '/board/write/'+boardType;
            }

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
                    memberCode: e.memberCode,
                    memberNickname: e.memberNickname,
                    boardType: e.boardType,
                    postNo: e.postNo,
                    postTitle: e.postTitle,
                    postDate: e.postDate.split(' ')[0].replaceAll("-","")==today? e.postDate.split(' ')[1]: e.postDate.split(' ')[0],
                    postHit: e.postHit,
                    postComments: e.postComments,
                    postLike: e.postLike,
                }
            });
        }
    })
}