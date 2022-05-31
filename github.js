class GitHub {
    constructor() {
        this.config = {
            headers: {
                Authorization: 'token ', // Token omitted for github
            },
        }
        this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    // async getUser(user) {
    //     const profileResponse = await fetch(`https://api.github.com/users/${user}`, this.config);

    //     const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}`, this.config);

    //     const profile = await profileResponse.json;
    //     const repos = await repoResponse.json;

    //     return {
    //         profile,
    //         repos
    //     }
    // }

    async getUser(user) {
        // cache the user so if we get a bad response we show the last 'good' user
        let cachedUser = {};

        const profileResponse = fetch(`https://api.github.com/users/${user}`, this.config);

        const repoResponse = fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}`, this.config);

        // concurrently fetch profile and repos
        const responses = await Promise.all([profileResponse, repoResponse]);

        // check response was good
        if (responses.every((res) => res.ok)) {
            const [profile, repos] = await Promise.all(responses.map((promise) => promise.json()));
            cachedUser = {profile, repos};
        } else {
            cachedUser.message = 'Not Found'
        }

        return cachedUser;
    }
}