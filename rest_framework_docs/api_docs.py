import re
from importlib import import_module
from django.conf import settings
from django.core.urlresolvers import RegexURLResolver, RegexURLPattern
from django.utils.module_loading import import_string
from rest_framework.views import APIView
from rest_framework_docs.api_endpoint import ApiEndpoint
from rest_framework_docs.settings import DRFSettings

class ApiDocumentation(object):

    def __init__(self, drf_router=None):
        self.endpoints = []
        self.drf_router = drf_router
        try:
            root_urlconf = import_string(settings.ROOT_URLCONF)
        except ImportError:
            # Handle a case when there's no dot in ROOT_URLCONF
            root_urlconf = import_module(settings.ROOT_URLCONF)
        if hasattr(root_urlconf, 'urls'):
            self.get_all_view_names(root_urlconf.urls.urlpatterns)
        else:
            self.get_all_view_names(root_urlconf.urlpatterns)

    def get_all_view_names(self, urlpatterns, parent_pattern=None, parent_pattern_so_far=''):
        ignored_namespaces = ['dynamic_data']
        settings = DRFSettings().settings
        only_urls = settings['INCLUDE_ONLY_URLS']

        for pattern in urlpatterns:
            pattern_so_far = parent_pattern_so_far + pattern.regex.pattern
            # if only_urls exists, ignore urls that are not in it
            print only_urls
            print pattern_so_far
            if only_urls and not [only_url for only_url in only_urls if only_url in pattern_so_far]:
                continue
            if [pattern for ignored_ns in ignored_namespaces if ignored_ns in pattern.regex.pattern]:
                continue
            if isinstance(pattern, RegexURLResolver):
                parent_pattern = None if pattern._regex == "^" else pattern
                self.get_all_view_names(urlpatterns=pattern.url_patterns, parent_pattern=parent_pattern,
                                        parent_pattern_so_far=pattern_so_far)
            elif isinstance(pattern, RegexURLPattern) and self._is_drf_view(pattern) and not self._is_format_endpoint(pattern):
                    
                if not settings['IGNORE_URL_REGEX'] or re.match(settings['IGNORE_URL_REGEX'], pattern.regex.pattern):
                    api_endpoint = ApiEndpoint(pattern, parent_pattern, self.drf_router)
                    self.endpoints.append(api_endpoint)

    def _is_drf_view(self, pattern):
        """
        Should check whether a pattern inherits from DRF's APIView
        """
        return hasattr(pattern.callback, 'cls') and issubclass(pattern.callback.cls, APIView)

    def _is_format_endpoint(self, pattern):
        """
        Exclude endpoints with a "format" parameter
        """
        return '?P<format>' in pattern._regex

    def get_endpoints(self):
        return self.endpoints
