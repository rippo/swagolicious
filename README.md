Swag-o-licious
============

New ASP.NET MVC swagometer using Bootstrap and KnockoutJS

Working example can be found here: http://swag.wildesoft.net/

**Important** At the moment this is only a single user application as it uses a static class to remember state

Used to give swag away for SmartDevs a developers user group based in Hereford.
http://www.meetup.com/Smart-Devs-User-Group/

To get started you will need latest version of Typescript (v0.9.5) http://www.microsoft.com/en-us/download/details.aspx?id=34790

You will also need to insert you Meetup API key into **ApiKey.config** but if sending in a pull request make sure you exclude the config file from GIT

e.g.

    git update-index --assume-unchanged Swagolicious/ApiKey.config
