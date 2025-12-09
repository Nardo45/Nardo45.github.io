const postBtn = document.getElementById('postBtn');
const newPostInput = document.getElementById('newPostInput');
const center = document.querySelector('.center');
const timelineContainer = document.getElementById('timelinePosts');

// function to fetch posts from server
async function fetchTimeline() {
    const res = await fetch('/post/timeline');
    const posts = await res.json();

    timelineContainer.innerHTML = ''; // clear old posts

    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('content');
        postDiv.innerHTML = `
            <div class="contentUserInfo">
                <img src="../img/user.png" alt="" class="contentUserImg">
                <p class="contentUserName">${post.author}</p>
            </div>
            <div class="contentArea">
                <p class="userPost">${post.content}</p>
            </div>
            <div class="interactArea">
                <div class="likeArea">
                    <svg class="likeBtn" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
            </div>
        `;
        timelineContainer.appendChild(postDiv);

        // add toggle logic for like button
        const likeBtn = postDiv.querySelector('.likeBtn');
        likeBtn.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });
}

// handle new post submission
postBtn.addEventListener('click', async () => {
    const content = newPostInput.value.trim();
    if (!content) return alert('Post cannot be empty!');

    const res = await fetch('/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });

    if (res.ok) {
        newPostInput.value = '';
        fetchTimeline(); // refresh timeline after posting
    } else {
        const data = await res.json();
        alert(data.message || 'Failed to post');
    }
});

// initial fetch on page load
fetchTimeline();
