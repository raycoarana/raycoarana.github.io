#############################################################################
#
# Modified version of jekyllrb Rakefile
# https://github.com/jekyll/jekyll/blob/master/Rakefile
#
#############################################################################

require 'rake'
require 'date'
require 'yaml'

CONFIG = YAML.load(File.read('_config.yml'))
USERNAME = CONFIG["username"]
REPO = CONFIG["repo"]
DESTINATION_BRANCH = "master"

namespace :site do
  desc "Generate the site"
  task :build do
    sh "bundle exec jekyll build"
  end

  desc "Check html"
  task :check => :build do
    sh "bundle exec htmlproofer #{CONFIG["destination"]}  --disable-external"
  end

  desc "Generate the site and serve locally"
  task :serve do
    sh "bundle exec jekyll serve"
  end

  desc "Generate the site, serve locally and watch for changes"
  task :watch do
    sh "bundle exec jekyll serve --watch"
  end

  desc "Generate the site and push changes to remote origin"
  task :deploy => :check do
    unless ENV['CI'].to_s.downcase == "true"
      puts 'Not in GitHub Workflow. Aborting publish'
      exit
    end

    sh "git config --global user.email 'release@raycoarana.com'"
    sh "git config --global user.name 'Release Bot'"
    sh "git config --global push.default simple"

    # Commit and push to github
    sha = ENV['GITHUB_SHA']
    Dir.chdir(CONFIG["destination"]) do
      # check if there is anything to add and commit, and pushes it
      sh "if [ -n '$(git status)' ]; then
            git add --all .;
            git commit -m 'Updating to #{USERNAME}/#{REPO}@#{sha}.';
            git push --quiet origin #{DESTINATION_BRANCH};
         fi"
      puts "Pushed updated branch #{DESTINATION_BRANCH} to GitHub Pages"
    end
  end
end
