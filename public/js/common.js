const agent = navigator.userAgent.toLowerCase();
if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
    $$('.notice_bar')[0].innerHTML+='<div class="notice red">현재 사용하시는 브라우저는 정상적으로 지원되지 않습니다</div>';
}
if(navigator.platform && /Mac|iPad|iPhone|iPod/.test(navigator.platform)){
    $$('.notice_bar')[0].innerHTML+='<div class="notice yellow">IOS환경에서는 제대로 동작하지 않을 수 있습니다.</div>';
}
window.addEventListener('online', ()=>{
    if($$('.notice_bar .offline').length){
        $$('.notice_bar .offline')[0].remove()
    }
})
window.addEventListener('offline', ()=>{
    $$('.notice_bar')[0].innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
})
if(!window.navigator.onLine){
    $$('.notice_bar')[0].innerHTML+='<div class="notice red offline">인터넷에 연결되어있지 않습니다.</div>'
}
let progressBar, progressBarFlag=0;
window.addEventListener('DOMContentLoaded', () => {
    progressBar = $$('.progress')[0];
})
const progress = per => {
    if(progressBar.style.left=="0%"){
        progressBarFlag+=1;
        progressBar.style.left='-100%';
        progressBar.classList.add('on');
        window.setTimeout(()=>{
            progressBar.style.left=`${per-100}%`;
        }, 1)
    }else{
        if(per>=100){
            window.setTimeout(()=>{
                if(progressBarFlag-1==0){
                    progressBar.classList.add('remove');
                }
                window.setTimeout(()=>{
                    progressBarFlag-=1;
                    if(progressBarFlag==0){
                        progressBar.classList.remove('on');
                        progressBar.classList.remove('remove');
                    }
                }, 450)
            }, 1000);
        }else{
            progressBar.classList.add('on');
        }
        progressBar.style.left=`${per-100}%`;
    }
}