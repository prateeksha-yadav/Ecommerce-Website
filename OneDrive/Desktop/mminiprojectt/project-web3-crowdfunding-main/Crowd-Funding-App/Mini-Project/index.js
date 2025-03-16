var i=0;
    
        function change()
        {
            var arr=new Array();
            arr[0]="https://images.unsplash.com/photo-1566959621395-9200c65ba74b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY3ODQ2MA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            arr[1]="https://images.unsplash.com/photo-1524229648276-e66561fe45a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY3OTE5Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            arr[2]="https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY3OTQ4OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            arr[3]="https://images.unsplash.com/photo-1624902525150-cbb93356b93f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY3OTMzMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            arr[4]="https://images.unsplash.com/photo-1470075446540-4391a96ec621?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsYmVhY2h8fHx8fHwxNjI2NjgwNDY4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            arr[5]="https://images.unsplash.com/photo-1600941393513-a5224603246a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGVsaGksTW9udW1lbnRzfHx8fHx8MTYyNjY4MDcyNw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            // arr[6]="https://images.unsplash.com/photo-1548013146-72479768bada?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY4MDE3Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            // arr[7]="https://images.unsplash.com/photo-1442570468985-f63ed5de9086?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsYmVhY2h8fHx8fHwxNjI2NjgwNTQ3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            // arr[8]="https://images.unsplash.com/photo-1585828068970-7b75082485cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY4MDIyNg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
            // arr[9]="https://images.unsplash.com/photo-1599978559047-8e83c06e57e2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWEsTW9udW1lbnRzfHx8fHx8MTYyNjY4MDI4Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=2480";
           
            
            if(i==arr.length)
            {
                i=0;
                f1.image1.src=arr[i];
                i++;
            }
            else
            {
                f1.image1.src=arr[i];
                i++;
            }
            setTimeout("change()",2000);
        }
        window.onload=change;

let readmore = document.getElementById('readmore')
let para = document.getElementById('para')
readmore.addEventListener('click',()=>{
    if(para.classList.contains("parachanged")){
        readmore.innerHTML="Read More"
        para.classList.remove("parachanged")
    }
    else{
        para.classList.add("parachanged")
        readmore.innerHTML="Read Less"
    }
})


function search(){
    let mainitems=document.querySelector(".mainitems")
    let search=document.querySelector(".search")
    let head=document.querySelector(".head")
    let foot=document.querySelector(".foot")
    head.classList.add("hide")
    foot.classList.add("hide")
    mainitems.classList.add("hide")
    search.classList.remove("hide")

}

function searchClose(){
    let mainitems=document.querySelector(".mainitems")
    let search=document.querySelector(".search")
    let head=document.querySelector(".head")
    let foot=document.querySelector(".foot")
    head.classList.remove("hide")
    foot.classList.remove("hide")
    mainitems.classList.remove("hide")
    search.classList.add("hide")
}