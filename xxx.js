let indextpl =()=>`
<!DOCTYPE html>
<html ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
   ${theformx()}
    <div   id="qneuf"></div>
</body>
<script>
if(document.getElementById("laformx"))
{

    let laformx = document.getElementById("laformx");
    let ft = fetch("http://localhost:3000/register/4",{method:"POST", body:JSON.stringify({name:"fola"})})
ft.then(_=>_.text()).then(_=>console.log('dhfhf _'));
}
    </script>
</html>
`;

function theformx(){
    
        return `
            <form action="" method="post" id="laformx">
            <input type="text" name="xname" id="xname">
            <input type="text" name="xhobby" id="xhobby">
            <input type="button" value="send">
            </form>
        `;
    }

module.exports.index= function(){return indextpl();};
