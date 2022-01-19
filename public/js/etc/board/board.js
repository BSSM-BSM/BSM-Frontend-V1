let boardType = window.location.pathname.split('/')[2];
let page = new URLSearchParams(location.search).get("page");
let limit = new URLSearchParams(location.search).get("limit");
if(limit==null){
    limit=15;
}
$$('.board_limit .select')[0].innerText=limit+"개";
const boardTitle = new Vue({
    el:'.board_title',
    data:{
        boardName:'',
        boardType:'',
        subBoardName:'',
        subBoardType:''
    }
})
const boardChange = (changeBoard) => {
    switch(changeBoard){
        case 'board':
            boardType='board';
            boardTitle.boardType='board';
            boardTitle.boardName='자유게시판';
            boardTitle.subBoardType='anonymous';
            boardTitle.subBoardName='익명게시판';
            break;
        case 'anonymous':
            boardType='anonymous';
            boardTitle.boardType='anonymous';
            boardTitle.boardName='익명게시판';
            boardTitle.subBoardType='board';
            boardTitle.subBoardName='자유게시판';
            break;
        case 'notice':
            boardType='notice';
            boardTitle.boardType='notice';
            boardTitle.boardName='공지사항';
            boardTitle.subBoardType='';
            boardTitle.subBoardName='';
            break;
    }
    history.pushState(null, null, `/board/${boardType}${window.location.search}`)
    $$('.post')[0].classList.add('hide')
    if(page>1) boardPageChange(1)
    else boardRefresh();
}

const boardPageChange = (changePage) => {
    page=changePage;
    boardMenu.activePage=page;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('page', String(changePage));
    history.pushState(null, null, window.location.pathname+"?"+urlSearch.toString());
    boardRefresh();
}
const boardLimitChange = (changeLimit) => {
    limit=changeLimit;
    const urlSearch = new URLSearchParams(location.search);
    urlSearch.set('limit', String(changeLimit));
    history.pushState(null, null, window.location.pathname+"?"+urlSearch.toString());
    boardRefresh();
}
const boardMenu = new Vue({
    el:'.board_bottom_menu',
    data:{
        isLogin:false,
        writeUrl:'javascript:error_code(4, 1);',
        pages:0,
        activePage:0
    }
})
const boardView = new Vue({
    el:'.board_list',
    data:{
        posts:[]
    }
})
const boardRefresh = () => {
    progress(20);
    ajax({
        method:'get',
        url:`/board/${boardType}?page=${page}&limit=${limit}`,
        payload:{
            member_id:$$('.sign_up .member_id')[0].value,
            member_pw:$$('.sign_up .member_pw')[0].value,
            member_pw_check:$$('.sign_up .member_pw_check')[0].value,
            member_nickname:$$('.sign_up .member_nickname')[0].value,
            code:$$('.sign_up .code')[0].value,
        },
        callBack:data=>{
            if(member.isLogin){
                boardMenu.isLogin=true
                boardMenu.writeUrl='/board/write/'+boardType
            }
            boardMenu.activePage=page;
            boardMenu.pages=data.pages
            let date = new Date()
            let today = ""+date.getFullYear()
            if((date.getMonth()+1)<10){
                today+='0'
            }
            today+=(date.getMonth()+1)
            if(date.getDate()<10){
                today+='0'
            }
            today+=date.getDate()
            boardData=data.arrBoard;
            boardView.posts.splice(0)
            if(boardData!=null){
                for(let i=0;i<boardData.length;i++){
                    if(boardData[i].postDate.split(' ')[0].replaceAll("-","")==today)
                        boardData[i].postDate = boardData[i].postDate.split(' ')[1];
                    else{
                        boardData[i].postDate = boardData[i].postDate.split(' ')[0];
                        boardView.posts.push({
                            memberNickname:memberLevel[boardData[i].memberLevel]+boardData[i].memberNickname,
                            memberProfileUrl:`/memberinfo/${boardData[i].memberCode}`,
                            memberProfile:`/resource/member/profile_images/profile_${boardData[i].memberCode}.png`,
                            boardType:boardData[i].boardType,
                            postNo:boardData[i].postNo,
                            postTitle:boardData[i].postTitle,
                            postDate:boardData[i].postDate,
                            postHit:boardData[i].postHit,
                            postComments:boardData[i].postComments,
                            postLike:boardData[i].postLike,
                        })
                    }
                }
            }
        }
    })
}
switch(boardType){
    case 'board':
        boardType='board';
        boardTitle.boardType='board';
        boardTitle.boardName='자유게시판';
        boardTitle.subBoardType='anonymous';
        boardTitle.subBoardName='익명게시판';
        break;
    case 'anonymous':
        boardType='anonymous';
        boardTitle.boardType='anonymous';
        boardTitle.boardName='익명게시판';
        boardTitle.subBoardType='board';
        boardTitle.subBoardName='자유게시판';
        break;
    case 'notice':
        boardType='notice';
        boardTitle.boardType='notice';
        boardTitle.boardName='공지사항';
        boardTitle.subBoardType='';
        boardTitle.subBoardName='';
        break;
}
window.addEventListener('DOMContentLoaded', () => {
    if(postNo!=null)
        postRefresh();
    boardRefresh();
})