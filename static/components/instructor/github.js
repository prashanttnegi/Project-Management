export default {
  data() {
    return {
      commits: [], 
      loading: true, 
      team_id: ''
    };
  },
  async mounted() {
    this.team_id = this.$route.params.team_id;
    await this.fetchCommits(this.team_id);
  },
    template: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f1f1f1; border-radius: 10px;">
        <h2 style="font-size: 24px; margin-bottom: 20px;"><strong>Recent GitHub Activity</strong></h2>
        <!-- List of commits -->
        <div v-if="commits && commits.length > 0" style="max-height: 50vh; overflow-y: auto;">
          <ul style="list-style-type: none; padding: 0;">
            <li v-for="(commit, index) in commits" :key="index" style="margin-bottom: 15px;">
              <div style="display: flex; align-items: center; padding: 10px; background-color: #f5e6cc; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub logo" style="width: 50px; height: 50px; margin-right: 10px;">
                <div style="flex-grow: 1;">
                  <div style="margin-bottom: 5px;">
                    <p style="font-size: 16px; font-weight: bold; color: black;">{{ commit.message }}</p>
                    <a :href="commit.url" style="font-size: 14px; color: #888;" target="_blank">{{ commit.url }}</a>
                  </div>
                  <div style="font-size: 14px; color: black; display: flex; justify-content: space-between;">
                    <span><strong>Author:</strong> {{ commit.author }}</span>
                    <span>{{ formatDate(commit.date) }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-else-if="loading" style="font-size: 16px; color: #888;">
          <p>Loading commits...</p>
        </div>

        <div v-else style="font-size: 16px; color: #888;">
          <p>No commits found or an error occurred.</p>
        </div>
      </div>

  `,
    methods: {
      async fetchCommits() {
        this.team_id = this.$route.params.team_id;
        this.loading = true;
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/github/commits/${this.team_id}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          this.commits = data.commits || [];
        } catch (error) {
          console.error("Error fetching commits:", error);
          this.commits = [];
        } finally {
          this.loading = false;
        }
      },
      formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleString();
      },
    },
    mounted() {
      this.fetchCommits(); 
    },
  };
  