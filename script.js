// Global user data object
const userData = {
  name: '',
  ratings: [null, null, null],
  proposalAccepted: null
};

// Initialize page based on current URL
document.addEventListener('DOMContentLoaded', function() {
  // Load stored data if available
  const storedData = sessionStorage.getItem('userData');
  if (storedData) {
    Object.assign(userData, JSON.parse(storedData));
  }

  // Initialize specific page functionality
  if (document.getElementById('welcomeForm')) {
    initWelcomePage();
  } else if (document.getElementById('rizzContainer')) {
    initRizzPage();
  } else if (document.getElementById('proposalCat')) {
    initProposalPage();
  }
});

// Welcome Page Functions
function initWelcomePage() {
  const form = document.getElementById('welcomeForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (!username) {
      alert('Please enter your name!');
      return;
    }
    userData.name = username;
    saveUserData();
    window.location.href = 'rizz.html';
  });
}

// Rizz Page Functions
function initRizzPage() {
  // Display username in all steps
  for (let i = 1; i <= 3; i++) {
    const element = document.getElementById(`usernameDisplay${i}`);
    if (element) element.textContent = userData.name;
  }

  // Initialize star rating interactions
  document.querySelectorAll('.rating').forEach(ratingContainer => {
    ratingContainer.addEventListener('click', function(e) {
      if (e.target.tagName === 'LABEL') {
        const radio = document.getElementById(e.target.htmlFor);
        if (radio) {
          radio.checked = true;
          updateStarDisplay(radio);
        }
      }
    });
  });

  // Show current step based on progress
  let currentStep = 1;
  while (currentStep < 3 && userData.ratings[currentStep - 1] !== null) {
    document.getElementById(`step${currentStep}`).classList.add('hidden-step');
    currentStep++;
  }
  document.getElementById(`step${currentStep}`).classList.add('current-step');
}

function updateStarDisplay(selectedRadio) {
  const container = selectedRadio.closest('.rating');
  container.querySelectorAll('input').forEach(radio => {
    const label = document.querySelector(`label[for="${radio.id}"]`);
    if (label) {
      if (radio.checked || radio.value <= selectedRadio.value) {
        label.innerHTML = '<i class="fas fa-star text-yellow-500"></i>';
      } else {
        label.innerHTML = '<i class="far fa-star text-yellow-400"></i>';
      }
    }
  });
}

function nextStep(currentStep) {
  const rating = document.querySelector(`input[name="rate${currentStep}"]:checked`);
  if (!rating) {
    alert('Please rate this rizz before continuing!');
    return;
  }

  userData.ratings[currentStep - 1] = parseInt(rating.value);
  saveUserData();

  document.getElementById(`step${currentStep}`).classList.remove('current-step');
  document.getElementById(`step${currentStep}`).classList.add('hidden-step');

  if (currentStep < 3) {
    document.getElementById(`step${currentStep + 1}`).classList.remove('hidden-step');
    document.getElementById(`step${currentStep + 1}`).classList.add('current-step');
  } else {
    window.location.href = 'proposal.html';
  }
}

// Proposal Page Functions
function initProposalPage() {
  document.getElementById('usernameDisplay').textContent = userData.name;
  
  if (userData.proposalAccepted !== null) {
    showProposalResponse(userData.proposalAccepted);
  }
}

function acceptProposal(accepted) {
  userData.proposalAccepted = accepted;
  saveUserData();
  if (accepted) {
    window.location.href = 'happy.html';
  } else {
    showProposalResponse(accepted);
  }
}

function showProposalResponse(accepted) {
  const catImg = document.getElementById('proposalCat');
  const responseMsg = document.getElementById('responseMessage');
  
  if (accepted) {
    catImg.src = 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg';
    catImg.className = 'w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-green-400 transition-all';
    responseMsg.textContent = 'Meow! You made the right choice! ??';
    responseMsg.className = 'text-green-600 text-lg font-medium mb-4';
  } else {
    catImg.src = 'https://images.pexels.com/photos/96428/pexels-photo-96428.jpeg';
    catImg.className = 'w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-red-400 transition-all';
    responseMsg.textContent = 'Ouch! That hurts my feline feelings... ??';
    responseMsg.className = 'text-red-600 text-lg font-medium mb-4';
  }
  
  responseMsg.classList.remove('hidden');
}

function resetGame() {
  sessionStorage.removeItem('userData');
  window.location.href = 'index.html';
}

// Helper function
function saveUserData() {
  sessionStorage.setItem('userData', JSON.stringify(userData));
}