function contactUs(){
    var name=document.getElementById("name").value;
    var email=document.getElementById("email").value;
    var message=document.getElementById("message").value;
    var phno=document.getElementById("number").value;
    
         const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phre = /^\d{10}$/;
        if((!email.match(re)) || (!phno.match(phre)) ){
            alert("Please enter valid details");
        }
        else{
        Email.send({
        Host: "smtp.gmail.com",
        Username : "prateekshayadav01102004@gmail.com",
        Password : "prateeksha@4",
        To : "prateekshayadav01102004@gmail.com",
        Bcc: `${email}`,
        From : "prateekshayadav01102004@gmail.com",
        Subject : "Regarding Travel Guru Enquiry",
        Body : "Email: "+`${email}`+"<br>Name: "+`${name}`+"<br>Message: "+`${message}`+"<br>Phone Number: "+`${phno}`+"<br>We have received your query and we will get back to you shortly."
        }).then(
            message => alert("mail sent successfully")
        );
    }
    }