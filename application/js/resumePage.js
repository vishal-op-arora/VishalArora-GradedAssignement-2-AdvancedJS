import { JSON_SERVER_URL as JSON_SERVER_BASE_URL } from './constants.js';

let resumeIndex = 1;
let currentApplication = null;
let applicationFound = false;
let searchByName = true;
let resumes = [];
let refResume = [];
let appliedForResume = [];


const resumeLandingPage = () =>  {

    document.getElementById('body').innerHTML =
        `
            <div id = "resume-page">

                <button type="button" id="searchBy" class="login-btn btn" style ="width:200px;">Search By Applied For</button>
                <br>

                <table style="width:100%">
                    <tr>
                        <td style="width:20%">
                            <button type="button" id="resumePreviousBtn" class="login-btn btn" onclick="previousResume()" style ="width:200px;" hidden>Previous</button>
                        </td>



                        <td style="width:60%">
                            <input type="search" id="resumeFilterField" class="input-field-resume" placeholder="search with Applicant Name to filter the result">
                        </td>

                        <td style="width:20%">
                        <button type="button" id="resumeNextBtn" type="submit" class="login-btn btn" style ="width:200px; margin-left:10px;">Next</button>
                        </td>
                    </tr>
                </table>
                <div id="resume-data">

                </div>
            </div>

        `;

    initalResume();

    // Previous Button
    document.getElementById('resumePreviousBtn').onclick = async function () {

        resumeIndex--;
        previousButton();
        nextButton();
        currentApplication = getResumeByIndex(resumeIndex);
        buildResume();
    };

    // Search Field
    document.getElementById('resumeFilterField').onchange = function (event){

        const filterValue = event.target.value;

        if(!searchByName){
            resumes = [];
            refResume.forEach( (resume) => {
                if(resume.basics.AppliedFor.toLowerCase() === filterValue.toLowerCase()){
                    resumes.push(resume);
                }
            });

            if(resumes.length !== 0 ) {
                applicationFound = true;
                resumeIndex = 0;
            }
            console.log(typeof resumes);
        }
        else {
            for( let i = 0; i < resumes.length; i++ ){
                if(getResumeByIndex(i).basics.name.toLowerCase() === filterValue.toLowerCase() ){
                    applicationFound = true;
                    resumeIndex = i;
                    break;
                }
            }
        }

        previousButton();
        nextButton();

        if( applicationFound ){
            currentApplication = getResumeByIndex(resumeIndex);
            buildResume();
            applicationFound = false;
        } else {
            noResultFound();
        }

        event.target.value = "";
    }

    // Next Button
    document.getElementById('resumeNextBtn').onclick = async function (){
        resumeIndex++;
        previousButton();
        nextButton();
        currentApplication = getResumeByIndex(resumeIndex);
        buildResume();
    };

    document.getElementById('searchBy').onclick = function () {
        searchByName = !searchByName;
        if(searchByName) {
            resumes = refResume;
            document.getElementById('searchBy').innerText = 'Search By Applied For';
            document.getElementById('resumeFilterField').setAttribute('placeholder', 'search with Applicant Name to filter the result');

        } else {
            resumes = [];
            document.getElementById('searchBy').innerText = 'Search By Appicant Name';
            document.getElementById('resumeFilterField').setAttribute('placeholder', 'search with Applied For to filter the result');
        }
        previousButton();
        nextButton();
    }

}


const previousButton = () => {
    if ( resumeIndex === 0 ){
        document.getElementById('resumePreviousBtn').setAttribute("hidden", "hidden");
    } else {
        document.getElementById('resumePreviousBtn').removeAttribute("hidden");
    }
}

const nextButton = ( ) => {
    if ( resumeIndex === (resumes.length - 1) ){
        document.getElementById('resumeNextBtn').setAttribute("hidden", "hidden");
    } else {
        document.getElementById('resumeNextBtn').removeAttribute("hidden");
    }
}

const getAPI = () => {
    let fetchResumes = [];
    fetch( JSON_SERVER_BASE_URL )
            .then( response => {
                return response.json();
            })
            .then(jData => {
                jData.map((data) => (fetchResumes.push(data)));
            })
            .catch( (error) => console.log(error.message) );
    return fetchResumes;
};


async function getResumeById (id) {
    var resumeByIdUrl = JSON_SERVER_BASE_URL + '/' + id;
    const response = await fetch( resumeByIdUrl );
    return await response.json();
};

const getResumeByIndex = (index) => {
    return resumes[index];
};


const noResultFound = () => {
    document.getElementById('resume-data').innerHTML = `
    <div id="dataNotFound">
        <img src="../../application/img/sad-face.svg" width=100px height=100px>
        <br>No such result found.
    </div>`;
}

const initalResume = async () => {
    refResume = getAPI();
    resumes = refResume;
    currentApplication = await getResumeById(resumeIndex);
    buildResume();
    resumeIndex = 0;
}

const buildResume = () => {

    document.getElementById('resume-data').innerHTML = `
        <table id="resumeHeading" style="width:100%">
            <tr >
                <td id="resume-title" style="width:80%"> </td>
                <td id="resume-image" style="width:20%"> </td>
            </tr>
        </table>

        <table id="resumePersonalWork" style="width:100%">
            <tr>
                <td style="width:25%; vertical-align: top;">
                    <div id="resume-basic"> <div>
                </td>
                <td style="width:75%; vertical-align: top;">
                    <div id="resume-work"> <div>
                </td>
            </tr>
            <br>
        </table>

    `;

    document.getElementById('resume-title').innerHTML = `
    <h1>${currentApplication.basics.name}</h1>
    <br />
    <h3>Applied For ${currentApplication.basics.AppliedFor} </h3>
    `;

    document.getElementById('resume-image').innerHTML = `<img src="../../application/img/person-circle.svg" width=120px height=120px>`;
    document.getElementById('resume-basic').innerHTML = getPersonalInformation();
    document.getElementById('resume-work').innerHTML = getWorkExperience();
    document.getElementById("technical-skills").innerHTML  = getTechnicalSkills();
    document.getElementById("achievements").innerHTML = getHobbies();
    document.getElementById("hobbies").innerHTML = getAchievements();
}

const getWorkExperience = () => {
    return `

    <div class="work-title">Work Experience in previous company</div>
    <div class="work-info">

        <span class="work-subtitle">Company Name : </span> <span> ${currentApplication.work["Company Name"]}</span><br>
        <span class="work-subtitle">Position : </span><span> ${currentApplication.work.Position}</span><br>
        <span class="work-subtitle">Start Date : </span><span> ${currentApplication.work["Start Date"]}</span><br>
        <span class="work-subtitle">End Date : </span><span> ${currentApplication.work["End Date"]}</span><br>
        <span class="work-subtitle">Summary : </span><span> ${currentApplication.work.Summary}</span><br>

    </div>

    <div class="work-title">Projects</div>
    <div class="work-info">
        <span class="work-subtitle">${currentApplication.projects.name} : </span> <span>${currentApplication.projects.description}</span><br>
    </div>

    <div class="work-title">Education</div>
    <div class="work-info">
        <ul>
            <li>
                <span class="work-subtitle">UG : </span>
                <span>
                    ${currentApplication.education.UG.institute},
                    ${currentApplication.education.UG.course},
                    ${currentApplication.education.UG["Start Date"]} -
                    ${currentApplication.education.UG["End Date"]},
                    ${currentApplication.education.UG.cgpa} CGPA
                </span>
            </li>

            <li>
                <span class="work-subtitle">Senior Secondary : </span>
                <span>
                    ${currentApplication.education["Senior Secondary"].institute},
                    ${currentApplication.education["Senior Secondary"].cgpa} CGPA
                </span>
            </li>

            <li>
                <span class="work-subtitle">High School : </span>
                <span>
                    ${currentApplication.education["High School"].institute},
                    ${currentApplication.education["High School"].cgpa} CGPA
                </span>
            </li>

        </ul>

        <br>
    </div>

    <div class="work-title">Internship</div>
    <div class="work-info">
        <ul>
            <li><span class="work-subtitle">Company Name : </span> <span> ${currentApplication.Internship["Company Name"]}</span></li>
            <li><span class="work-subtitle">Position : </span><span> ${currentApplication.Internship.Position}</span></li>
            <li><span class="work-subtitle">Start Date : </span><span> ${currentApplication.Internship["Start Date"]}</span></li>
            <li><span class="work-subtitle">End Date : </span><span> ${currentApplication.Internship["End Date"]}</span></li>
            <li><span class="work-subtitle">Summary : </span><span> ${currentApplication.Internship.Summary}</span></li>
    </div>

    <div class="work-title">Achievements</div>
    <div class="work-info">
        <ul>
            <div id="achievements"> </div>
        </ul>
        <br>
    </div>

    `;
}

const getPersonalInformation = () => {
    return `
        <div class="basic-title">Personal Information</div>
        <div class="basic-info">
            <b>Mob. </b>${currentApplication.basics.phone}<br>
            <b>eMail. </b>${currentApplication.basics.email}<br>
            <a href=${currentApplication.basics.profiles.url}>
                ${currentApplication.basics.profiles.network}
            </a> <br>

            <b>Address. </b>#${currentApplication.basics.location.address},<br>
            Pincode - ${currentApplication.basics.location.postalCode},<br>
            ${currentApplication.basics.location.city},
            ${currentApplication.basics.location.state}<br>
        </div>
        <br>

        <div class="basic-title">Technical Skills</div>
        <div class="basic-info">
            <span id="technical-skills"> </span>
        </div>
        <br>

        <div class="basic-title">Hobbies</div>
        <div class="basic-info">
            <span id="hobbies"> </span>
        </div>
        <br>
    `;
}

const getTechnicalSkills = () => {

    let techElement = "";
    let techSkills = currentApplication.skills.keywords;
    let techSkillsCount = currentApplication.skills.keywords.length
    for(let i = 0; i < techSkillsCount; i++){
        techElement = techElement + `${techSkills[i]}<br>`;
    }

    return  techElement;
}

const getAchievements = () => {

    let achievementsElement = "";
    let achievements = currentApplication.achievements.Summary;
    let achievementsCount = currentApplication.achievements.Summary.length
    for(let i = 0; i < achievementsCount; i++){
        achievementsElement = achievementsElement + `<li>${achievements[i]}</li>`;
    }

    return achievementsElement;
}

const getHobbies = () => {

    let hobbiesElement = "";
    let hobbies = currentApplication.interests.hobbies;
    let hobbiesCount = currentApplication.interests.hobbies.length;
    for(let i = 0; i < hobbiesCount; i++){
        hobbiesElement = hobbiesElement + `${hobbies[i]}<br>`;
    }

    return hobbiesElement;
}

export { resumeLandingPage };