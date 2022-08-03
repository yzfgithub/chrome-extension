
const host = location.hostname;
switch(host) {
	case "blog.csdn.net":
			dealCSDN()
			break;
	case "www.zhihu.com":
			dealZHIHU()
		break;
	default:
		break;
}

function dealCSDN(){
	document.body.contentEditable = true;
	var expandList = document.getElementsByClassName('look-more-preCode');
	for(var i = expandList.length -1; i>=0 ; i--) {
		(function(j){
			console.log(j,'j');
			expandList[j].click();
		})(i)
	}
	var contentDom = document.getElementById("article_content");
	contentDom.style.height="auto"
	var hideDom = document.getElementsByClassName('hide-article-box');
	if(hideDom.length) {
		hideDom[0].style.display="none"
	}
} 

function dealZHIHU() {
	var closeDom = document.getElementsByClassName('Modal-closeButton');
	if(closeDom.length) {
		closeDom[0].click()
	}
}
