/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { moveInstrumentation } from './ue-utils.js';

const SUPPORTED_BLOCKS = new Set([
  'callout',
  'cards',
  'featured-profile',
  'sidenav',
  'tags',
  'toc',
]);

function queueRemovedNodes(cache, target, nodes) {
  const removed = [...nodes].filter((node) => (
    node.nodeType === Node.ELEMENT_NODE
  ));

  if (!removed.length) return;

  const queued = cache.get(target) || [];
  cache.set(target, queued.concat(removed));
}

function takeRemovedNodes(cache, target, nodes) {
  const removed = [...nodes].filter((node) => (
    node.nodeType === Node.ELEMENT_NODE
  ));

  if (removed.length) {
    cache.delete(target);
    return removed;
  }

  const queued = cache.get(target) || [];
  cache.delete(target);
  return queued;
}

function moveNodeList(sourceNodes, targetNodes) {
  sourceNodes.forEach((sourceNode, index) => {
    const targetNode = targetNodes[index];
    if (sourceNode && targetNode) {
      moveInstrumentation(sourceNode, targetNode);
    }
  });
}

function getMutationType(target) {
  if (target.classList.contains('cards-card-image')) return 'cards-image';

  const component = target.getAttribute('data-aue-component');
  if (component) return component;

  return [...target.classList].find((className) => SUPPORTED_BLOCKS.has(className));
}

function handleCardsMutation(removedNodes, addedNodes) {
  if (addedNodes.length !== 1 || addedNodes[0].tagName !== 'UL') return;

  moveNodeList(removedNodes, [...addedNodes[0].children]);
}

function handleCardsImageMutation(removedNodes, addedNodes) {
  const oldPicture = removedNodes.find((node) => node.tagName === 'PICTURE');
  const newPicture = [...addedNodes].find((node) => node.tagName === 'PICTURE');

  if (!oldPicture || !newPicture) return;

  moveInstrumentation(oldPicture.querySelector('img'), newPicture.querySelector('img'));
}

function handleCalloutMutation(removedNodes, addedNodes) {
  const container = [...addedNodes].find((node) => node.classList?.contains('callout-container'));
  if (!container) return;

  moveNodeList(removedNodes, [
    container.querySelector('.callout-title'),
    container.querySelector('.callout-desc'),
  ]);
}

function handleFeaturedProfileMutation(removedNodes, addedNodes) {
  const container = [...addedNodes].find((node) => node.classList?.contains('featured-profile-container'));
  if (!container) return;

  moveNodeList(removedNodes, [
    container.querySelector('h4'),
    container.querySelector('.profile-image'),
    container.querySelector('.profile-name'),
    container.querySelector('.profile-role'),
    container.querySelector('.profile-quote'),
  ]);
}

function handleSidenavMutation(removedNodes, addedNodes) {
  const aside = [...addedNodes].find((node) => node.classList?.contains('sidenav-wrapper'));
  if (!aside) return;

  moveNodeList(removedNodes, [
    aside.querySelector('.sidenav-title-group'),
    aside.querySelector('.sidenav-primary-nav'),
    aside.querySelector('.sidenav-secondary-nav'),
  ]);
}

function handleTagsMutation(removedNodes, addedNodes) {
  const list = [...addedNodes].find((node) => node.tagName === 'UL');
  if (!list) return;

  moveNodeList(removedNodes, [...list.children]);
}

function handleTocMutation(removedNodes, addedNodes) {
  const nav = [...addedNodes].find((node) => node.tagName === 'NAV');
  if (!nav) return;

  moveNodeList(removedNodes, [nav.querySelector('h3')]);
}

function setupObservers() {
  const removedNodeCache = new WeakMap();
  const mutatingBlocks = document.querySelectorAll(
    'div.callout, div.cards, div.featured-profile, div.sidenav, div.tags, div.toc',
  );

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList' || mutation.target.tagName !== 'DIV') return;

      const removedNodes = [...mutation.removedNodes].filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      );
      if (removedNodes.length) {
        queueRemovedNodes(removedNodeCache, mutation.target, removedNodes);
      }

      const addedNodes = [...mutation.addedNodes].filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      );
      if (!addedNodes.length) return;

      const type = getMutationType(mutation.target);
      const queuedRemovedNodes = takeRemovedNodes(removedNodeCache, mutation.target, removedNodes);

      switch (type) {
        case 'cards':
          handleCardsMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'cards-image':
          handleCardsImageMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'callout':
          handleCalloutMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'featured-profile':
          handleFeaturedProfileMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'sidenav':
          handleSidenavMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'tags':
          handleTagsMutation(queuedRemovedNodes, addedNodes);
          break;
        case 'toc':
          handleTocMutation(queuedRemovedNodes, addedNodes);
          break;
        default:
          break;
      }
    });
  });

  mutatingBlocks.forEach((block) => {
    observer.observe(block, { childList: true, subtree: true });
  });
}

function setupUEEventHandlers() {
  document.body.addEventListener('aue:content-patch', ({ detail: { patch, request } }) => {
    let element = document.querySelector(`[data-aue-resource="${request.target.resource}"]`);
    if (element && element.getAttribute('data-aue-prop') !== patch.name) {
      element = element.querySelector(`[data-aue-prop='${patch.name}']`);
    }
    if (element?.getAttribute('data-aue-type') !== 'media') return;

    const picture = element.tagName === 'IMG' ? element.closest('picture') : element;
    picture?.querySelectorAll('source').forEach((source) => source.remove());
    picture?.querySelector('img')?.removeAttribute('srcset');
  });
}

export default () => {
  setupObservers();
  setupUEEventHandlers();
};
