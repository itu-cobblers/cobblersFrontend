import { Icon } from '@components/Icon'
import { Button } from '@components/Button'
import { Modal } from '@components/Modal'
import type { ProjectBriefProps } from './ProjectBrief.types'
import { useSetupGuideModal } from './ProjectBrief.hooks'
import {
  BRIEF_PDF_CLASS,
  BRIEF_PDF_HEADER_CLASS,
  BRIEF_PDF_LINK_CLASS,
  BRIEF_PDF_FRAME_CLASS,
  PDF_VIEWER_FRAGMENT,
  BRIEF_SETUP_BUTTON_CLASS,
  SETUP_MODAL_TITLE_CLASS,
  SETUP_MODAL_LINK_CLASS,
  SETUP_MODAL_BODY_CLASS,
  SETUP_MODAL_H5_CLASS,
  SETUP_MODAL_LIST_CLASS,
  SETUP_MODAL_CLOSE_WRAP_CLASS,
} from './ProjectBrief.constants'

const JAVA_SETUP_DOC_URL = 'https://code.visualstudio.com/docs/languages/java'

/**
 * A project assignment's brief: the original PDF embedded directly, plus a
 * "Set up your Java environment" button opening the setup guide in a popup
 * (rather than an inline fold) with a link out to the official doc. Shared
 * verbatim between the student `AssignmentPanel` and the teacher
 * `TeacherAssignmentPanel` so both render project briefs identically.
 */
export default function ProjectBrief({ title, projectIdentity }: ProjectBriefProps) {
  const [isSetupOpen, openSetup, closeSetup] = useSetupGuideModal()

  return (
    <>
      <div className={BRIEF_PDF_CLASS}>
        <div className={BRIEF_PDF_HEADER_CLASS}>
          <a
            href={projectIdentity.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={BRIEF_PDF_LINK_CLASS}
          >
            Open in new tab ↗
          </a>
        </div>
        <iframe
          src={`${projectIdentity.pdfUrl}${PDF_VIEWER_FRAGMENT}`}
          title={`${title} brief`}
          className={BRIEF_PDF_FRAME_CLASS}
        />
      </div>

      <button type="button" onClick={openSetup} className={BRIEF_SETUP_BUTTON_CLASS}>
        Set up your Java environment
        <Icon name="info" />
      </button>

      <Modal isOpen={isSetupOpen} onClose={closeSetup} size="lg">
        <h3 className={SETUP_MODAL_TITLE_CLASS}>Set up your Java environment</h3>
        <a
          href={JAVA_SETUP_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={SETUP_MODAL_LINK_CLASS}
        >
          Official VS Code Java setup guide ↗
        </a>
        <div className={SETUP_MODAL_BODY_CLASS}>
          <p>Two ways to get ready — pick one.</p>
          <p>
            <span className={SETUP_MODAL_H5_CLASS}>Option 1 — Coding Pack for Java (recommended)</span>
            <br />
            One download installs the JDK, VS Code, and the extensions you need together. Easiest way to start.
          </p>
          <div>
            <span className={SETUP_MODAL_H5_CLASS}>Option 2 — Manual setup</span>
            <p>Install these three yourself:</p>
            <ul className={SETUP_MODAL_LIST_CLASS}>
              <li>
                <strong>JDK</strong> — compiles and runs your code. Add it to your system&rsquo;s Environment
                Variables so the <code>java</code> command works in a terminal.
              </li>
              <li>
                <strong>VS Code</strong> — the editor you&rsquo;ll write in.
              </li>
              <li>
                <strong>VS Code Java Extension Pack</strong> — from the VS Code marketplace. Lets VS Code talk to
                the JDK (autocomplete, error checking).
              </li>
            </ul>
          </div>
          <div>
            <span className={SETUP_MODAL_H5_CLASS}>Before you start</span>
            <ul className={SETUP_MODAL_LIST_CLASS}>
              <li>Open the whole project folder in VS Code — not a single file.</li>
              <li>
                File names are case-sensitive and must end in exactly <code>.java</code>.
              </li>
              <li>Avoid spaces or special characters in folder and file names.</li>
            </ul>
          </div>
          <p>
            When you&rsquo;re done, upload your <code>.java</code> files below and press Submit to save your attempt
            — submitting once unlocks the reference answer.
          </p>
        </div>
        <div className={SETUP_MODAL_CLOSE_WRAP_CLASS}>
          <Button variant="ghost" onClick={closeSetup}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
