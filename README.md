# Live preview

https://floating-bastion-95136.herokuapp.com/

# Youtube video showcasing the functionality

https://youtu.be/LNBXs-N-lRY

# Assignment

# Domestic Repairs

You have been asked to develop a website for a company that specialises in the repair of domestic white goods such as washing machines and cookers.

---

## Testing

The system should include the data for at least 10 real issues and include the correct details for each. The customer details should also be valid.

You are required to create the following accounts to allow the system to be tested. All accounts should have the password `p455w0rd`:

1. `customer1`
2. `customer2`
3. `technician1`
4. `technician2`

---

## Feature 1

If a user is logged in they should see a **New issue** link or button on the home screen, which takes them to a screen to report a new issue. They should be prompted for the following information:

1. The type of appliance (from a fixed list).
2. A slider where they can select the age of the appliance in years (max age 10).
3. The appliance manufacturer (from a fixed list).
4. A short one line summary of the fault (max 100 characters).
5. A multi-line description of the fault that supports the use of _markdown_ syntax.
6. A slider where they can state how much they will pay for the work (max £200).

The system should also store the following data without the user needing to enter it:

1. The location of the user (longitude and latitude).
2. The date and time the issue was logged.
3. The username of the person logging the issue.
4. The status which should be set to _unassigned_.
5. The assigned technician field which should be left blank.

## Feature 2

If the user is logged in their home page should list a summary of athe jobs they have added to the system. Only the following information should be displayed:

1. The type of appliance.
2. The summary.
3. The date the issue was added (but not the time).
4. The status (at this stage it should be set as _unassigned_).
