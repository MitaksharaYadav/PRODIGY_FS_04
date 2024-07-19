document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postContent = document.getElementById('postContent');
    const postList = document.getElementById('postList');

    // Fetch and display posts on page load
    fetchPosts();

    // Handle form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = postContent.value.trim();

        if (content) {
            // Send POST request to server
            await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            postContent.value = '';
            fetchPosts();
        }
    });

    async function fetchPosts() {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        postList.innerHTML = posts.map(post => `
            <li class="animated fadeInUp">${post.content}</li>
        `).join('');
    }
});
