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
        <button type="button" onClick={openSetup} className={BRIEF_SETUP_BUTTON_CLASS}>
          Click here to learn how to install VS Code and Java.
          <Icon name="info" />
        </button>
        <iframe
          src={`${projectIdentity.pdfUrl}${PDF_VIEWER_FRAGMENT}`}
          title={`${title} brief`}
          className={BRIEF_PDF_FRAME_CLASS}
        />
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
      </div>

      <Modal isOpen={isSetupOpen} onClose={closeSetup} size="lg">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className={SETUP_MODAL_TITLE_CLASS}>Install VS Code and Java</h3>

          <Button
              variant="solid"
              onClick={() => window.open(JAVA_SETUP_DOC_URL, '_blank', 'noopener,noreferrer')}
              className="shrink-0"
          >
            Official VS Code Java setup guide
            <Icon name="externalLink" />
          </Button>
        </div>

        <div className={SETUP_MODAL_BODY_CLASS}>
          <section>
            <h5 className={SETUP_MODAL_H5_CLASS}>Option 1: Coding Pack for Java (Recommended)</h5>
            <p>
              Best if you are starting from scratch with nothing installed. A single installer sets up
              the JDK, VS Code, and all required extensions together. It&rsquo;s the easiest and fastest
              way to get started.
            </p>
          </section>

          <section>
            <h5 className={SETUP_MODAL_H5_CLASS}>Option 2: Manual Setup</h5>
            <p>Best if you already have Java or an IDE installed. Install only the components you need:</p>
            <ul className={SETUP_MODAL_LIST_CLASS}>
              <li>
                <strong>JDK:</strong> Compiles and runs your code. Be sure to add it to your
                system&rsquo;s Environment Variables so the <code>java</code> terminal command works.
              </li>
              <li>
                <strong>VS Code:</strong> The code editor you will write in.
              </li>
              <li>
                <strong>VS Code Java Extension Pack:</strong> Install this from the marketplace so VS Code
                can connect to your JDK for autocomplete and error checking.
              </li>
            </ul>
          </section>

          <section>
            <h5 className={SETUP_MODAL_H5_CLASS}>Before You Start</h5>
            <ul className={SETUP_MODAL_LIST_CLASS}>
              <li>Always open the entire project folder in VS Code, rather than just an individual file.</li>
              <li>
                File names are case-sensitive and must end with <code>.java</code>.
              </li>
              <li>Avoid using spaces or special characters in any folder or file names.</li>
            </ul>
          </section>

          <p>
            Once you&rsquo;re finished, upload your <code>.java</code> files below and click{' '}
            <strong>Submit</strong>.
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
