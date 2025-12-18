# Construction Phase - Mermaid Flow Diagram

## Overview
This diagram shows the per-unit loop structure of the Construction Phase, where each unit goes through the same stages.

```mermaid
graph TD
    Start([Units from Inception]) --> UnitLoop{For Each Unit}
    
    %% Functional Design Stage
    UnitLoop -->|Unit N| FD[Functional Design]
    FD -->|Reads| FD_Rule[.kiro/aws-aidlc-rule-details/<br/>construction/functional-design.md]
    FD -->|Loads| Inception[Inception Artifacts:<br/>requirements.md<br/>stories.md<br/>components.md<br/>unit-of-work.md]
    FD_Rule -->|Creates| FD_Plan[aidlc-docs/construction/plans/<br/>{unit-name}-functional-design-plan.md]
    FD_Plan -->|User Answers| FD_Check{Ambiguities?}
    FD_Check -->|Yes| FD_Clarify[aidlc-docs/construction/plans/<br/>{unit-name}-functional-design-clarification.md]
    FD_Check -->|No| FD_Gen
    FD_Clarify -->|User Answers| FD_Gen[Generate Artifacts]
    FD_Gen -->|Creates| FD_Entities[aidlc-docs/construction/{unit-name}/<br/>functional-design/domain-entities.md]
    FD_Gen -->|Creates| FD_Logic[aidlc-docs/construction/{unit-name}/<br/>functional-design/business-logic-model.md]
    FD_Gen -->|Creates| FD_Rules[aidlc-docs/construction/{unit-name}/<br/>functional-design/business-rules.md]
    FD_Rules -->|Updates| State_FD[aidlc-state.md]
    FD_Rules -->|Logs| Audit_FD[audit.md]
    
    %% NFR Requirements Stage
    FD_Rules --> NFR_Req[NFR Requirements]
    NFR_Req -->|Reads| NFR_Req_Rule[.kiro/aws-aidlc-rule-details/<br/>construction/nfr-requirements.md]
    NFR_Req -->|Loads| FD_Entities
    NFR_Req -->|Loads| FD_Logic
    NFR_Req -->|Loads| FD_Rules
    NFR_Req_Rule -->|Creates| NFR_Req_Plan[aidlc-docs/construction/plans/<br/>{unit-name}-nfr-requirements-plan.md]
    NFR_Req_Plan -->|User Answers| NFR_Req_Gen[Generate Artifacts]
    NFR_Req_Gen -->|Creates| NFR_Req_Doc[aidlc-docs/construction/{unit-name}/<br/>nfr-requirements/nfr-requirements.md]
    NFR_Req_Gen -->|Creates| NFR_Tech[aidlc-docs/construction/{unit-name}/<br/>nfr-requirements/tech-stack-decisions.md]
    NFR_Tech -->|Updates| State_NFR_Req[aidlc-state.md]
    NFR_Tech -->|Logs| Audit_NFR_Req[audit.md]
    
    %% NFR Design Stage
    NFR_Tech --> NFR_Des[NFR Design]
    NFR_Des -->|Reads| NFR_Des_Rule[.kiro/aws-aidlc-rule-details/<br/>construction/nfr-design.md]
    NFR_Des -->|Loads| NFR_Req_Doc
    NFR_Des -->|Loads| NFR_Tech
    NFR_Des_Rule -->|Creates| NFR_Des_Plan[aidlc-docs/construction/plans/<br/>{unit-name}-nfr-design-plan.md]
    NFR_Des_Plan -->|User Answers| NFR_Des_Check{Ambiguities?}
    NFR_Des_Check -->|Yes| NFR_Des_Clarify[aidlc-docs/construction/plans/<br/>{unit-name}-nfr-design-clarification.md]
    NFR_Des_Check -->|No| NFR_Des_Gen
    NFR_Des_Clarify -->|User Answers| NFR_Des_Gen[Generate Artifacts]
    NFR_Des_Gen -->|Creates| NFR_Patterns[aidlc-docs/construction/{unit-name}/<br/>nfr-design/nfr-design-patterns.md]
    NFR_Des_Gen -->|Creates| NFR_Components[aidlc-docs/construction/{unit-name}/<br/>nfr-design/logical-components.md]
    NFR_Components -->|Updates| State_NFR_Des[aidlc-state.md]
    NFR_Components -->|Logs| Audit_NFR_Des[audit.md]
    
    %% Code Generation Stage - Part 1: Planning
    NFR_Components --> CG_Plan_Stage[Code Generation<br/>PART 1: Planning]
    CG_Plan_Stage -->|Reads| CG_Rule[.kiro/aws-aidlc-rule-details/<br/>construction/code-generation.md]
    CG_Plan_Stage -->|Loads| FD_Entities
    CG_Plan_Stage -->|Loads| FD_Logic
    CG_Plan_Stage -->|Loads| FD_Rules
    CG_Plan_Stage -->|Loads| NFR_Patterns
    CG_Plan_Stage -->|Loads| NFR_Components
    CG_Rule -->|Creates| CG_Plan[aidlc-docs/construction/plans/<br/>{unit-name}-code-generation-plan.md]
    CG_Plan -->|Contains| CG_Steps[Detailed Steps with Checkboxes:<br/>Step 1: Create utility X<br/>Step 2: Create component Y<br/>Step 3: Update component Z<br/>...<br/>Step N: Update documentation]
    CG_Steps -->|User Approves| CG_Gen_Stage[Code Generation<br/>PART 2: Generation]
    
    %% Code Generation Stage - Part 2: Generation
    CG_Gen_Stage -->|Executes| Step1[Step 1: Create Files]
    Step1 -->|Generates| Code1[src/utils/utility.js<br/>src/components/Component.jsx<br/>src/components/Component.module.css]
    Code1 -->|Marks Complete| Check1[✓ Step 1 in plan]
    
    Check1 --> Step2[Step 2: Update Files]
    Step2 -->|Modifies| Code2[src/App.jsx<br/>src/contexts/Context.jsx]
    Code2 -->|Marks Complete| Check2[✓ Step 2 in plan]
    
    Check2 --> Step3[Step 3: Create Tests]
    Step3 -->|Generates| Code3[Test fixtures<br/>Test documentation]
    Code3 -->|Marks Complete| Check3[✓ Step 3 in plan]
    
    Check3 --> StepN[Step N: Update Docs]
    StepN -->|Updates| CodeN[README.md<br/>TESTING.md]
    CodeN -->|Marks Complete| CheckN[✓ Step N in plan]
    
    CheckN -->|All Steps Complete| CG_Complete[Code Generation Complete]
    CG_Complete -->|Updates| State_CG[aidlc-state.md]
    CG_Complete -->|Logs| Audit_CG[audit.md]
    
    %% Unit Complete - Loop or Continue
    CG_Complete --> UnitComplete{More Units?}
    UnitComplete -->|Yes| UnitLoop
    UnitComplete -->|No| BT[Build and Test]
    
    %% Build and Test Stage
    BT -->|Reads| BT_Rule[.kiro/aws-aidlc-rule-details/<br/>construction/build-and-test.md]
    BT_Rule -->|Creates| BT_Build[aidlc-docs/construction/build-and-test/<br/>build-instructions.md]
    BT_Rule -->|Creates| BT_Unit[aidlc-docs/construction/build-and-test/<br/>unit-test-instructions.md]
    BT_Rule -->|Creates| BT_Integration[aidlc-docs/construction/build-and-test/<br/>integration-test-instructions.md]
    BT_Rule -->|Creates| BT_Summary[aidlc-docs/construction/build-and-test/<br/>build-and-test-summary.md]
    BT_Summary -->|Updates| State_BT[aidlc-state.md]
    BT_Summary -->|Logs| Audit_BT[audit.md]
    
    BT_Summary --> End([Construction Complete<br/>Ready for Operations])
    
    %% Styling
    classDef steeringFile fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef planFile fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef artifactFile fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    classDef codeFile fill:#b2dfdb,stroke:#00695c,stroke-width:3px
    classDef stateFile fill:#ffccbc,stroke:#d84315,stroke-width:2px
    classDef decision fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
    classDef stage fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class FD_Rule,NFR_Req_Rule,NFR_Des_Rule,CG_Rule,BT_Rule steeringFile
    class FD_Plan,FD_Clarify,NFR_Req_Plan,NFR_Des_Plan,NFR_Des_Clarify,CG_Plan planFile
    class Inception,FD_Entities,FD_Logic,FD_Rules,NFR_Req_Doc,NFR_Tech,NFR_Patterns,NFR_Components,BT_Build,BT_Unit,BT_Integration,BT_Summary artifactFile
    class Code1,Code2,Code3,CodeN codeFile
    class State_FD,State_NFR_Req,State_NFR_Des,State_CG,State_BT,Audit_FD,Audit_NFR_Req,Audit_NFR_Des,Audit_CG,Audit_BT stateFile
    class FD_Check,NFR_Des_Check,UnitComplete decision
    class CG_Plan_Stage,CG_Gen_Stage stage
```

## Legend

- **Blue boxes**: Steering files (rules that guide the process)
- **Yellow boxes**: Plan files (questions and clarifications)
- **Green boxes**: Artifact files (design documents)
- **Teal boxes**: Code files (actual implementation)
- **Orange boxes**: State tracking files
- **Purple diamonds**: Decision points
- **Light orange boxes**: Stage markers

## Key Insights

1. **Per-unit loop**: Each unit goes through the same 4 stages (Functional Design, NFR Requirements, NFR Design, Code Generation)
2. **Artifacts build on each other**: Each stage loads artifacts from previous stages
3. **Two-part code generation**: Planning creates a detailed checklist, then generation executes it step-by-step
4. **Checkbox tracking**: Each step in the code generation plan is marked complete as work is done
5. **Continuous state updates**: aidlc-state.md and audit.md are updated after each stage
6. **Build and Test at the end**: After all units are complete, comprehensive testing instructions are generated
