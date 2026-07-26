import React, { useEffect, useMemo, useState } from "react";
import { AppRuntime } from "./AppRuntime.jsx";
import { CommandPalette } from "./CommandPalette.jsx";
import { GlossaryLayer } from "./GlossaryLayer.jsx";
import { IntelligenceTools } from "./IntelligenceTools.jsx";

export function WorkspaceRoot() {
  const [workspace, setWorkspace] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [epoch1Proof, setEpoch1Proof] = useState(null);
  const [epoch2Proof, setEpoch2Proof] = useState(null);
  const [epoch3Proof, setEpoch3Proof] = useState(null);
  const [epoch4Proof, setEpoch4Proof] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch("/runtime/workspace-data.json", { cache: "no-store" }),
      fetch("/runtime/epoch1-validated-case.json", { cache: "no-store" }),
      fetch("/runtime/epoch2-evidence-case.json", { cache: "no-store" }),
      fetch("/runtime/epoch3-risk-case.json", { cache: "no-store" }),
      fetch("/runtime/epoch4-learning-case.json", { cache: "no-store" })
    ])
      .then(
        async ([
          workspaceResponse,
          proofResponse,
          evidenceResponse,
          riskResponse,
          learningResponse
        ]) => {
          if (
            !workspaceResponse.ok ||
            !proofResponse.ok ||
            !evidenceResponse.ok ||
            !riskResponse.ok ||
            !learningResponse.ok
          )
            throw new Error("workspace data unavailable");
          return [
            await workspaceResponse.json(),
            await proofResponse.json(),
            await evidenceResponse.json(),
            await riskResponse.json(),
            await learningResponse.json()
          ];
        }
      )
      .then(([data, proof, evidence, risk, learning]) => {
        if (!active) return;
        validateWorkspaceSnapshot(data);
        validateEpoch1Proof(proof);
        validateEpoch2Proof(evidence);
        validateEpoch3Proof(risk);
        validateEpoch4Proof(learning);
        setWorkspace(data);
        setEpoch1Proof(proof);
        setEpoch2Proof(evidence);
        setEpoch3Proof(risk);
        setEpoch4Proof(learning);
        setSelectedId(data.candidates?.[0]?.id ?? null);
      })
      .catch(() => {
        if (active) {
          setWorkspace(null);
          setError(true);
        }
      });

    function handleCandidateSelected(event) {
      setSelectedId(event.detail?.id ?? null);
    }

    window.addEventListener("traderframe:candidate-selected", handleCandidateSelected);
    return () => {
      active = false;
      window.removeEventListener("traderframe:candidate-selected", handleCandidateSelected);
    };
  }, []);

  const selected = useMemo(() => {
    if (!workspace) return null;
    return (
      workspace.candidates.find((candidate) => candidate.id === selectedId) ??
      workspace.candidates[0] ??
      null
    );
  }, [workspace, selectedId]);

  return (
    <>
      <AppRuntime
        workspace={workspace}
        selectedId={selected?.id ?? null}
        error={error}
        epoch1Proof={epoch1Proof}
        epoch2Proof={epoch2Proof}
        epoch3Proof={epoch3Proof}
        epoch4Proof={epoch4Proof}
        onSelect={setSelectedId}
      />
      {selected ? <IntelligenceTools candidate={selected} /> : null}
      <CommandPalette workspace={workspace} selectedId={selected?.id ?? null} />
      <GlossaryLayer />
    </>
  );
}

function validateEpoch4Proof(proof) {
  if (
    !proof ||
    proof.dataMode !== "LOCAL_DETERMINISTIC_LEARNING_FIXTURE" ||
    proof.sourceCaseCount < 3 ||
    proof.report?.status !== "REVIEW_REQUIRED" ||
    proof.report?.operatorReviewRequired !== true ||
    proof.report?.recommendationFinal !== false ||
    proof.report?.updatesRules !== false ||
    proof.report?.updatesRiskLimits !== false ||
    proof.report?.predictiveClaim !== false ||
    proof.report?.performanceClaim !== false ||
    proof.checkpoint?.status !== "PASS" ||
    proof.checkpoint?.deterministic !== true ||
    proof.checkpoint?.sourceChainsValid !== true ||
    proof.checkpoint?.requiredPatternsExercised !== true ||
    proof.checkpoint?.executionPath !== false
  ) {
    throw new Error("Epoch 4 proof failed its local boundary contract");
  }
}

function validateEpoch3Proof(proof) {
  if (
    !proof ||
    proof.dataMode !== "LOCAL_PORTFOLIO_RISK_FIXTURE" ||
    proof.reviewAssessment?.status !== "REVIEW_REQUIRED" ||
    proof.reviewAssessment?.operatorReviewRequired !== true ||
    proof.reviewAssessment?.riskApproval !== false ||
    proof.blockedAssessment?.status !== "BLOCKED" ||
    proof.checkpoint?.status !== "PASS" ||
    proof.checkpoint?.deterministic !== true ||
    proof.checkpoint?.portfolioBlockersExercised !== true ||
    proof.checkpoint?.executionPath !== false
  ) {
    throw new Error("Epoch 3 proof failed its local boundary contract");
  }
}

function validateEpoch2Proof(proof) {
  if (
    !proof ||
    proof.dataMode !== "LOCAL_EVIDENCE_INTELLIGENCE_FIXTURE" ||
    proof.checkpoint?.status !== "PASS" ||
    proof.checkpoint?.operatorReviewRequired !== true ||
    proof.checkpoint?.executionPath !== false
  ) {
    throw new Error("Epoch 2 proof failed its local boundary contract");
  }
}

function validateEpoch1Proof(proof) {
  if (
    !proof ||
    proof.dataMode !== "LOCAL_VALIDATED_FIXTURE" ||
    proof.trace?.lifecycleStatus !== "COMPLETE" ||
    proof.checkpoint?.status !== "PASS" ||
    proof.simulation?.executionPath !== false
  ) {
    throw new Error("Epoch 1 proof failed its local boundary contract");
  }
}

function validateWorkspaceSnapshot(data) {
  if (
    !data ||
    data.schemaVersion !== 1 ||
    data.dataMode !== "SYNTHETIC_DEMO" ||
    !data.boundary ||
    data.boundary.assessmentAuthority !== "NON_CANONICAL_DEMO" ||
    data.boundary.recommendationOwner !== "CANONICAL_DECISION_ASSESSMENT_ONLY" ||
    data.boundary.executionPath !== false ||
    data.boundary.automatedAction !== false ||
    !Array.isArray(data.candidates) ||
    data.candidates.length === 0
  ) {
    throw new Error("workspace snapshot failed its local boundary contract");
  }
}
