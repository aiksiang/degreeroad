CREATE TABLE Modules (
	moduleCode CHAR(15) PRIMARY KEY,
	moduleTitle CHAR(100),
	semester CHAR(20),
	modularCredits INT,
	faculty CHAR(20),
	moduleDescription TEXT
);


CREATE TABLE Preclusion (
	moduleCode CHAR(15) REFERENCES Modules(moduleCode)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	preclusion CHAR(15) REFERENCES Modules(moduleCode)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE PreRequisite (
	moduleCode CHAR(15) REFERENCES Modules(moduleCode)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	prerequisite CHAR(15) REFERENCES Modules(moduleCode)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);


CREATE TABLE ModuleFacilitators (
	moduleCode CHAR(15) REFERENCES Modules(moduleCode)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	faciltator CHAR(30)
)