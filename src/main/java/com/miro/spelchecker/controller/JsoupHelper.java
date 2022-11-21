package com.miro.spelchecker.controller;

import org.jsoup.internal.StringUtil;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.NodeTraversor;
import org.jsoup.select.NodeVisitor;

import java.util.Map;

public class JsoupHelper {

    /**
     * Format an Element to plain-text
     * @param element the root element to format
     * @return formatted text
     */
    public static String getPlainText(Element element, Map<Integer, TextNode> indexMapping) {
        FormattingVisitor formatter = new FormattingVisitor(indexMapping);
        NodeTraversor.traverse(formatter, element); // walk the DOM, and call .head() and .tail() for each node

        return formatter.toString();
    }

    // the formatting rules, implemented in a breadth-first DOM traverse
    private static class FormattingVisitor implements NodeVisitor {
        private final Map<Integer, TextNode> indexMapping;
        private StringBuilder accum = new StringBuilder(); // holds the accumulated text

        public FormattingVisitor(Map<Integer, TextNode> indexMapping) {
            this.indexMapping = indexMapping;
        }

        // hit when the node is first seen
        public void head(Node node, int depth) {
            String name = node.nodeName();
            if (node instanceof TextNode) {
                indexMapping.put(accum.length(), (TextNode) node);
                append(((TextNode) node).text());// TextNodes carry all user-readable text in the DOM.
            }
            else if (name.equals("li"))
                append("\n * ");
            else if (name.equals("dt"))
                append("  ");
            else if (StringUtil.in(name, "p", "h1", "h2", "h3", "h4", "h5", "tr"))
                append("\n");
        }

        // hit when all of the node's children (if any) have been visited
        public void tail(Node node, int depth) {
            String name = node.nodeName();
            if (StringUtil.in(name, "br", "dd", "dt", "p", "h1", "h2", "h3", "h4", "h5"))
                append("\n");
            else if (name.equals("a"))
                append(String.format(" <%s>", node.absUrl("href")));
        }

        // appends text to the string builder with a simple word wrap method
        private void append(String text) {
            accum.append(text);
        }

        @Override
        public String toString() {
            return accum.toString();
        }
    }
}
