const api = "http://localhost:3000/notes";

function addNote(){

    const note = {

        title: document.getElementById("title").value,
        subject: document.getElementById("subject").value,
        description: document.getElementById("description").value
    };

    fetch(api,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(note)
    })
    .then(res=>res.json())
    .then(data=>{
        loadNotes();
    });
}


function loadNotes() {

    fetch(api)
    .then(res => res.json())
    .then(data => {

        let html = "";

        data.forEach(n => {

            html += `
            <div class="note">
            <h3>${n.title}</h3>
            <p><b>Subject:</b> ${n.subject}</p>
            <p>${n.description}</p>
            <button class="delete-btn" onclick="deleteNote('${n._id}')">Delete</button>
            </div>
            `;
        });

        document.getElementById("notes").innerHTML = html;

    });
}


function deleteNote(id){

    fetch(api+"/"+id,{
        method:"DELETE"
    })
    .then(()=>loadNotes());
}


loadNotes();