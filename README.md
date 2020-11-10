# <img src="https://seekvectorlogo.com/wp-content/uploads/2018/05/national-oilwell-varco-nov-vector-logo.png" alt="NOV Logo" width="200"> <br/> Samples for Microservices and DevOps Training

This repository contains samples for the Microservices and DevOps training

## Content

This repository contains the following components:
- Sample Beacons microservice in Golang
- Sample Beacons microservice in Node.js
- Sample Beacons microservice in .NET

## Rules

Contributors who work with repositories shall obey to the following rules:
- The repository shall contain only well defined components. Each component shall be one of the standard types and shall be placed into the root folder. If a person is unsure about what component type he/she shall create, talk to a responsible architect or a team lead.
- Each and every component in this repository must have an independent lifecycle. It shall be possible to develop, build and deploy a component independently from other components.
- Each component shall have an owner who is clearly identified in the documentation (usually  in the README file at the component folder). The owner must be fully responsible for the component until he/she is replaced by another owner.
- Name of all components must follow the prescribed conventions. They shall be in lowercase and use the format: \<type\>-\<name\>[-\<language\>]. For instance: service-assets-go, script-cicd-ps, lib-instrumentation-node
- Each component shall have the minimal documentation: README.md, CHANGE.md. Software components must have auto-generated API documentation placed under /docs folder.

The following behaviors must be strictly prohibited:
- Referencing components directly through the file system. All references must be versioned, released and retrieved through binary repositories such as NPM, NuGet or Docker Registry. For Golang components use only versioned dependencies.
- Creating scripts or build processes that tie multiple components at the source code level. Only when a component is built, tested and released by a corresponding CI/CD pipeline it can be used elsewhere.
- Storing in the repository anything other than components. Things like scripts, documentation, utilities must be identified as formal components and located together with other components.
- Changing multiple components at once and then pushing the changes in a single commit.

Standard component types:
- service - service or a microservice
- client - client library for a service or a microservice
- lib - shared library
- app - frontend application
- facade - external facade
- sdk - client SDK (software development kit)
- process - system process or daemon
- test - system-level tests
- script - build or maintenance scripts
- env - automated environment
- image - docker image

## Contacts

The responsible for this repository is *Sergey Seroukhov*.
