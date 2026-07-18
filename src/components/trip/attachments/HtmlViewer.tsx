import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

import { getHtmlFile } from '../../../lib/api';
import { useSurmaiContext } from '../../../app/useSurmaiContext';

export const HtmlViewer = ({ url }: { url: string }) => {
  const [htmlContents, setHtmlContents] = useState<string>();

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'a') {
      const anchor = node as HTMLAnchorElement;
      anchor.setAttribute('target', '_blank');

      const currentRel = anchor.getAttribute('rel') || '';
      if (!currentRel.includes('noopener')) {
        anchor.setAttribute('rel', `${currentRel} noopener noreferrer`.trim());
      }
    }
  });

  const { isMobile } = useSurmaiContext();

  useEffect(() => {
    getHtmlFile(url).then((text) => {
      setHtmlContents(DOMPurify.sanitize(text, { FORCE_BODY: true, ADD_ATTR: ['target'] }));
    });
  }, [url]);

  return (
    <iframe
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      srcDoc={htmlContents as string}
      style={{
        border: 'none',
        width: '100vw',
        height: isMobile ? '70vh' : '60vh',
      }}
    />
  );
};
